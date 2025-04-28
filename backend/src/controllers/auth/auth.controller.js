const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');
const prisma  = require('../../config/prismaClient');
const { JWT_SECRET } = require('../../config/env');

const ACCESS_EXP  = '1d';
const REFRESH_DAYS = 7;

/* ------------------------------ helpers -------------------------------- */
const signAccess = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXP });

const makeRefresh = async (userId) => {
  const raw  = crypto.randomBytes(40).toString('hex');           // 80-char
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  await prisma.refreshToken.create({
    data: { tokenHash: hash, userId, expiresAt: new Date(Date.now() + REFRESH_DAYS*864e5) }
  });
  return raw;         // we return the plaintext to drop in HttpOnly cookie
};

const setRefreshCookie = (res, rawToken) =>
  res.cookie('refresh', rawToken, {
    httpOnly: true, secure: true, sameSite: 'lax',
    maxAge: REFRESH_DAYS * 864e5
  });

/* ------------------------------- register ------------------------------ */
async function register(req, res) {
  const { email, password, firstName='', lastName='', role='STUDENT' } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email & password required' });

  const okRole = ['ADMIN','FACULTY','STUDENT'].includes(role.toUpperCase());
  if (!okRole) return res.status(400).json({ message: 'Bad role' });

  if (await prisma.user.findUnique({ where: { email } }))
    return res.status(409).json({ message: 'Email already registered' });

  const user = await prisma.user.create({
    data: { email, password: await bcrypt.hash(password,10),
            firstName, lastName, role: role.toUpperCase() }
  });

  const access  = signAccess({ id: user.id, role: user.role });
  const refresh = await makeRefresh(user.id);
  setRefreshCookie(res, refresh);

  res.status(201).json({ accessToken: access });
}

/* -------------------------------- login -------------------------------- */
async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const access  = signAccess({ id: user.id, role: user.role });
  const refresh = await makeRefresh(user.id);
  setRefreshCookie(res, refresh);

  res.json({ accessToken: access });
}

/* -------------------------------- refresh ------------------------------ */
async function refresh(req, res) {
  const raw = req.cookies.refresh;
  if (!raw) return res.status(401).json({ message: 'No refresh cookie' });

  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash: hash } });
  if (!stored || stored.expiresAt < new Date())
    return res.status(401).json({ message: 'Refresh invalid' });

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  const access = signAccess({ id: user.id, role: user.role });

  // rotate refresh token
  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const newRaw = await makeRefresh(user.id);
  setRefreshCookie(res, newRaw);

  res.json({ accessToken: access });
}

/* -------------------------------- logout ------------------------------- */
async function logout(req, res) {
  const raw = req.cookies.refresh;
  if (raw) {
    const hash = crypto.createHash('sha256').update(raw).digest('hex');
    await prisma.refreshToken.deleteMany({ where: { tokenHash: hash } });
  }
  res.clearCookie('refresh', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' })
     .json({ success: true });
}

module.exports = { register, login, refresh, logout };
