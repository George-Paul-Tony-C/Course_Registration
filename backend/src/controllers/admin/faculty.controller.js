/**
 *  Admin ⇢ Course ⇢ Faculty
 *  ------------------------------------------------------------------
 *  POST   /admin/courses/:id/faculty        
 *  GET    /admin/courses/:id/faculty
 *  DELETE /admin/courses/:id/faculty/:fid
 */
const prisma = require('../../config/prismaClient');
const audit  = require('../../utils/audit');

/* ------------ replace faculty list --------------------------------- */
async function assign(req, res, next) {
  try {
    const courseId = Number(req.params.id);
    const { facultyIds = [] } = req.body;   // array of ints

    await prisma.$transaction([
      prisma.courseFaculty.deleteMany({ where: { course_id: courseId } }),
      prisma.courseFaculty.createMany({
        data: facultyIds.map(fid => ({ course_id: courseId, faculty_id: fid })),
        skipDuplicates: true
      })
    ]);

    audit(req.user.id, 'ASSIGN_FACULTY', { courseId, facultyIds });
    res.json({ success: true });
  } catch (err) { next(err); }
}

/* ------------ list faculty ----------------------------------------- */
async function list(req, res, next) {
  try {
    const courseId = Number(req.params.id);
    const rows = await prisma.courseFaculty.findMany({
      where: { course_id: courseId },
      include: { faculty: true }
    });
    res.json(rows);
  } catch (err) { next(err); }
}

/* ------------ list his courses ----------------------------------------- */

async function listMyCourses(req, res, next) {
  try {
    const facultyId = Number(req.params.id);
    const rows = await prisma.courseFaculty.findMany({
      where: { faculty_id: facultyId },
      include: { course: true }
    });
    res.json(rows);
  } catch (err) { next(err); }
}


/* ------------ remove one faculty ----------------------------------- */
async function remove(req, res, next) {
  try {
    const courseId  = Number(req.params.id);
    const facultyId = Number(req.params.fid);

    await prisma.courseFaculty.delete({
      where: { course_id_faculty_id: { course_id: courseId, faculty_id: facultyId } }
    });

    audit(req.user.id, 'REMOVE_FACULTY', { courseId, facultyId });
    res.json({ success: true });
  } catch (err) { next(err); }
}

module.exports = { assign, list, remove , listMyCourses};
