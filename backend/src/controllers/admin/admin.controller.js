// src/controllers/admin/admin.controller.js
const prisma = require('../../config/prismaClient');

/* ───── Users ───────────────────────────────────────────── */
async function listUsers(req, res) {
  const { role, deleted } = req.query;
  const where = {
    ...(role && { role }),
    ...(deleted && { isDeleted: deleted === 'true' })
  };
  const users = await prisma.user.findMany({ where });
  res.json(users);
}

async function createUser(req, res) {
  const { email, password, firstName='', lastName='', role='STUDENT' } = req.body;
  // reuse helper for hashing etc.
  // …
}

async function updateUser(req, res) {
  const id = +req.params.id;
  const { firstName, lastName, isDeleted, role } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data: { firstName, lastName, isDeleted, role }
  });
  res.json(user);
}

/* ───── Courses ─────────────────────────────────────────── */
async function listCourses(req, res) {
  const { status } = req.query;
  const courses = await prisma.course.findMany({
    where: status ? { status } : undefined,
    include: { faculty: { include: { faculty: true } } }
  });
  res.json(courses);
}

async function createCourse(req, res) {
  const { code, title, description } = req.body;
  const course = await prisma.course.create({
    data: {
      code, title, description,
      createdById: req.user.id   // admin as creator
    }
  });
  res.status(201).json(course);
}

async function updateCourse(req, res) {
  const id = +req.params.id;
  const { title, description, status } = req.body;
  const course = await prisma.course.update({
    where: { id },
    data: { title, description, status }
  });
  res.json(course);
}

async function assignFaculty(req, res) {
  const id = +req.params.id;
  const { facultyIds } = req.body;           // [int,int,…]

  // clear then add
  await prisma.courseFaculty.deleteMany({ where: { courseId: id } });
  await prisma.courseFaculty.createMany({
    data: facultyIds.map(fid => ({ courseId: id, facultyId: fid })),
    skipDuplicates: true
  });
  res.json({ success: true });
}

/* ───── Audit log ───────────────────────────────────────── */
async function listAudit(req, res) {
  const logs = await prisma.auditLog.findMany({
    orderBy: { loggedAt: 'desc' },
    take: 100
  });
  res.json(logs);
}

module.exports = {
  listUsers, createUser, updateUser,
  listCourses, createCourse, updateCourse, assignFaculty,
  listAudit
};
