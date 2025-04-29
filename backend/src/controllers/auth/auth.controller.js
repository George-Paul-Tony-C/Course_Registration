const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');
const prisma  = require('../../config/prismaClient');
const { JWT_SECRET } = require('../../config/env');
const audit = require('../../utils/audit'); 

const ACCESS_EXP   = '1h';
const REFRESH_DAYS = 7;

/* helpers ----------------------------------------------------------------*/
const signAccess = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXP });

async function makeRefresh(userId) {
  const raw  = crypto.randomBytes(40).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');

  await prisma.refreshToken.create({
    data: {
      tokenHash: hash,
      userId,
      expiresAt: new Date(Date.now() + REFRESH_DAYS * 86_400_000)
    }
  });
  return raw;
}

const setRefreshCookie = (res, raw) =>
  res.cookie('refresh', raw, {
    httpOnly : true,
    secure   : process.env.NODE_ENV === 'production',
    sameSite : 'lax',
    maxAge   : REFRESH_DAYS * 86_400_000
  });

/* REGISTER ---------------------------------------------------------------*/
async function register(req, res, next) {
  try {
    const { username, email, password, role = 'STUDENT' } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'username, email, password required' });

    const roleUpper = role.toUpperCase();
    if (!['ADMIN', 'FACULTY', 'STUDENT'].includes(roleUpper))
      return res.status(400).json({ message: 'role must be ADMIN, FACULTY or STUDENT' });

    const [byEmail, byUser] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } })
    ]);
    if (byEmail) return res.status(409).json({ message: 'email already registered' });
    if (byUser)  return res.status(409).json({ message: 'username already taken' });

    const user = await prisma.user.create({
      data: { username, email, password_hash: await bcrypt.hash(password, 12), role: roleUpper }
    });

    const access  = signAccess({ id: user.id, role: user.role });
    const refresh = await makeRefresh(user.id);
    setRefreshCookie(res, refresh);

    res.status(201).json({ accessToken: access });
  } catch (err) { next(err); }
}

/* LOGIN ------------------------------------------------------------------*/
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.is_deleted) return res.status(404).json({ message: 'user not found' });

    if (!(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ message: 'invalid credentials' });

    const access  = signAccess({ id: user.id, role: user.role });
    const refresh = await makeRefresh(user.id);
    setRefreshCookie(res, refresh);

    /* NEW → record this login in audit_log */
    audit(user.id, 'LOGIN', { ip: req.ip });

    res.json({ accessToken: access });
  } catch (err) { next(err); }
}

/* REFRESH ----------------------------------------------------------------*/
async function refresh(req, res, next) {
  try {
    const raw = req.cookies.refresh;
    if (!raw) return res.status(401).json({ message: 'no refresh cookie' });

    const hash   = crypto.createHash('sha256').update(raw).digest('hex');
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hash } });
    if (!stored || stored.expiresAt < new Date())
      return res.status(401).json({ message: 'refresh token invalid' });

    const user = await prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user || user.is_deleted) return res.status(404).json({ message: 'user not found' });

    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const newRaw = await makeRefresh(user.id);
    setRefreshCookie(res, newRaw);

    res.json({ accessToken: signAccess({ id: user.id, role: user.role }) });
  } catch (err) { next(err); }
}

/* LOGOUT -----------------------------------------------------------------*/
async function logout(req, res, next) {
  try {
    const raw = req.cookies.refresh;
    if (raw) {
      const hash = crypto.createHash('sha256').update(raw).digest('hex');
      await prisma.refreshToken.deleteMany({ where: { tokenHash: hash } });
    }
    res.clearCookie('refresh', {
      httpOnly : true,
      secure   : process.env.NODE_ENV === 'production',
      sameSite : 'lax'
    }).json({ success: true });
  } catch (err) { next(err); }
}

/* ─────── GET /api/auth/me ────────────────────────────────────────── */
async function me(req, res, next) {
  try {
    /* 1. basic profile (exclude password) ---------------------------- */
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true, username: true, email: true, role: true,
        is_deleted: true, created_at: true, updated_at: true
      }
    });
    if (!user || user.is_deleted) return res.status(404).json({ message: 'user not found' });

    /* 2. last login -------------------------------------------------- */
    const last = await prisma.auditLog.findFirst({
      where: { actor_id: req.user.id, action: 'LOGIN' },
      orderBy: { logged_at: 'desc' },
      select: { logged_at: true }
    });

    /* 3. latest 10 activity records --------------------------------- */
    const logs = await prisma.auditLog.findMany({
      where: { actor_id: req.user.id },
      orderBy: { logged_at: 'desc' },
      take: 10,
      select: { id: true, action: true, details_json: true, logged_at: true }
    });

    res.json({
      user,
      lastLogin: last?.logged_at || null,
      logs
    });
  } catch (err) { next(err); }
}


/* ─────── PUT /api/auth/password ──────────────────────────────────── */
async function changePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: 'oldPassword & newPassword required' });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'user not found' });

    const ok = await bcrypt.compare(oldPassword, user.password_hash);
    if (!ok) return res.status(401).json({ message: 'old password incorrect' });

    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash: await bcrypt.hash(newPassword, 12) }
    });

    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  changePassword          // ← export new handler
};
