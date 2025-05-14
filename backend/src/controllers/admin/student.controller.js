/**
 *  Admin ⇢ Course ⇢ Students
 *  ------------------------------------------------------------------
 *  GET    /admin/courses/:id/students
 *  POST   /admin/courses/:id/students      body:{ facultyId, studentIds:[…] }
 *  PATCH  /admin/courses/:id/students/:sid body:{ facultyId }   (move)
 *  DELETE /admin/courses/:id/students/:sid
 */
const prisma = require('../../config/prismaClient');
const audit  = require('../../utils/audit');

/* ------------ list students ---------------------------------------- */
async function list(req, res, next) {
  try {
    const courseId = Number(req.params.id);
    const rows = await prisma.courseStudent.findMany({
      where: { course_id: courseId },
      include: { student: true, faculty: true }
    });
    res.json(rows);
  } catch (err) { next(err); }
}

/* ------------ list his courses ----------------------------------------- */

async function listMyCourses(req, res, next) {
  try {
    const studentId = Number(req.params.id);
    const rows = await prisma.courseStudent.findMany({
      where: { student_id: studentId },
      include: { course: true }
    });
    res.json(rows);
  } catch (err) { next(err); }
}

/* ------------ enrol many (optionally under a faculty) -------------- */
async function enroll(req, res, next) {
  try {
    const courseId = Number(req.params.id);
    const { facultyId = null, studentIds = [] } = req.body;

    await prisma.courseStudent.createMany({
      data: studentIds.map(sid => ({
        course_id : courseId,
        student_id: sid,
        faculty_id: facultyId
      })),
      skipDuplicates: true
    });

    audit(req.user.id, 'ENROLL_STUDENTS', { courseId, facultyId, studentIds });
    res.json({ success: true });
  } catch (err) { next(err); }
}

/* ------------ move a student to another faculty -------------------- */
async function move(req, res, next) {
  try {
    const courseId  = Number(req.params.id);
    const studentId = Number(req.params.sid);
    const { facultyId = null } = req.body;

    await prisma.courseStudent.update({
      where: { course_id_student_id: { course_id: courseId, student_id: studentId } },
      data : { faculty_id: facultyId }
    });

    audit(req.user.id, 'MOVE_STUDENT', { courseId, studentId, facultyId });
    res.json({ success: true });
  } catch (err) { next(err); }
}

/* ------------ remove one student ----------------------------------- */
async function remove(req, res, next) {
  try {
    const courseId  = Number(req.params.id);
    const studentId = Number(req.params.sid);

    await prisma.courseStudent.delete({
      where: { course_id_student_id: { course_id: courseId, student_id: studentId } }
    });

    audit(req.user.id, 'REMOVE_STUDENT', { courseId, studentId });
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { list, enroll, move, remove , listMyCourses};
