/**
 *  Admin → Users CRUD
 *  --------------------------------------------------------------------
 *  GET    /admin/users
 *  GET    /admin/users/student
 *  GET    /admin/users/faculty
 *  GET    /admin/users/admin
 *  POST   /admin/users
 *  PATCH  /admin/users/:id
 *  DELETE /admin/users/:id   (hard delete)
 */

const prisma = require('../../config/prismaClient');
const { hash } = require('../../utils/password');
const audit = require('../../utils/audit');
const { ROLES } = require('../../utils/roles');

const normalizeRole = (r) => (typeof r === 'string' ? r.toUpperCase() : undefined);

/* General list with optional query filters */
async function list(req, res, next) {
  try {
    const { role, deleted } = req.query;

    const where = {
      ...(role && { role: normalizeRole(role) }),
      ...(deleted && { is_deleted: deleted === 'true' })
    };

    const users = await prisma.user.findMany({ where });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

/* Role-specific lists */
async function listStudents(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT', is_deleted: false }
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function listFaculty(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'FACULTY', is_deleted: false }
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function listAdmins(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'ADMIN', is_deleted: false }
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

/* Create user */
async function create(req, res, next) {
  try {
    const { email, password, username, role = 'STUDENT' } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email & password required' });
    }

    const roleUpper = normalizeRole(role);
    if (!ROLES.includes(roleUpper)) {
      return res.status(400).json({ message: 'bad role value' });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: 'email already exists' });

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password_hash: await hash(password),
        role: roleUpper
      }
    });

    audit(req.user.id, 'CREATE_USER', { target: user.id });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

/* Update user */
async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'invalid id' });

    const { username, isDeleted, role } = req.body;

    const data = {
      ...(username !== undefined && { username }),
      ...(isDeleted !== undefined && { is_deleted: !!isDeleted }),
      ...(role !== undefined && { role: normalizeRole(role) })
    };

    if (!Object.keys(data).length) {
      return res.status(400).json({ message: 'no updatable fields supplied' });
    }

    if (data.role && !ROLES.includes(data.role)) {
      return res.status(400).json({ message: 'bad role value' });
    }

    const user = await prisma.user.update({ where: { id }, data });

    audit(req.user.id, 'UPDATE_USER', { target: id, diff: data });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

/* Delete user */
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'invalid id' });

    await prisma.user.delete({ where: { id } });
    audit(req.user.id, 'DELETE_USER', { target: id });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  list,
  listStudents,
  listFaculty,
  listAdmins,
  create,
  update,
  remove
};
