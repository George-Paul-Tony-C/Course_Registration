// === Updated Backend Controller (controllers/admin/course.js) ===

const prisma = require('../../config/prismaClient');
const audit = require('../../utils/audit');

// GET - Paginated + Status Filtered Course List
async function list(req, res, next) {
  try {
    const { status, includeArchived = false, page = 1, size = 10 } = req.query;

    const where = {
      ...(status ? { status } : {}),
      ...(includeArchived === 'true' ? {} : { is_deleted: false }),
    };

    const total = await prisma.course.count({ where });
    const courses = await prisma.course.findMany({
      where,
      include: {
        faculties: { include: { faculty: true } },
        students: { include: { student: true, faculty: true } },
      },
      skip: (Number(page) - 1) * Number(size),
      take: Number(size),
      orderBy: { created_at: 'desc' },
    });

    res.json({ total, courses });
  } catch (err) {
    next(err);
  }
}


// list Active Courses
async function listActive(req, res, next) {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'ACTIVE' },
      include: {
        faculties: { include: { faculty: true } },
        students: { include: { student: true, faculty: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    
    res.json(courses);
  } catch (err) {
    next(err);
  }
}


// list Pending Courses
async function listPending(req, res, next) {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'PENDING' },
      include: {
        faculties: { include: { faculty: true } },
        students: { include: { student: true, faculty: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    
    res.json(courses);
  } catch (err) {
    next(err);
  }
}


// list ARCHIVED Courses
async function listInActive(req, res, next) {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'ARCHIVED' },
      include: {
        faculties: { include: { faculty: true } },
        students: { include: { student: true, faculty: true } },
      },
      orderBy: { created_at: 'desc' },
    });
    
    res.json(courses);
  } catch (err) {
    next(err);
  }
}

// GET - Course by ID
async function getCourseById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        faculties: { include: { faculty: true } },
        students: { include: { student: true, faculty: true } },
      },
    });

    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    next(err);
  }
}


// PATCH - Approve or Reject Course
async function updateStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body; // expects: 'ACTIVE' or 'ARCHIVED'

    if (!['ACTIVE', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const course = await prisma.course.update({
      where: { id },
      data: {
        status,
        is_deleted: status === 'ARCHIVED',
      },
    });

    await audit(req.user.id, 'UPDATE_COURSE_STATUS', { courseId: id });
    res.json(course);
  } catch (err) {
    next(err);
  }
}


/* ------------ POST -------------------------------------------------- */
async function create(req, res, next) {
  try {
    const { code, title, description, status = 'DRAFT' } = req.body;

    if (!code || !title) {
      return res.status(400).json({ error: 'Code and Title are required.' });
    }

    // ✅ Check if course with same code or title exists
    const existing = await prisma.course.findFirst({
      where: {
        OR: [
          { code: code },
          { title: title }
        ]
      }
    });

    if (existing) {
      return res.status(409).json({ error: 'Course with the same code or title already exists.' });
    }

    const course = await prisma.course.create({
      data: {
        code,
        title,
        description,
        status,
        created_by: req.user.id,
      },
    });

    await audit(req.user.id, 'CREATE_COURSE', { courseId: course.id });
    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
}


/* ------------ PATCH -------------------------------------------------- */
async function update(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { title, description, status, unarchive = false } = req.body;

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Course not found' });

    const data = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(unarchive && { is_deleted: false, status: status ?? 'ACTIVE' }),
    };

    const updated = await prisma.course.update({
      where: { id },
      data,
    });

    await audit(req.user.id, 'UPDATE_COURSE', { courseId: id });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/* ------------ DELETE  (soft archive) ------------------------------- */
async function remove(req, res, next) {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.course.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Course not found' });

    await prisma.course.update({
      where: { id },
      data: { status: 'ARCHIVED', is_deleted: true },
    });

    await audit(req.user.id, 'ARCHIVE_COURSE', { courseId: id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove , getCourseById ,updateStatus , listActive , listPending , listInActive};
