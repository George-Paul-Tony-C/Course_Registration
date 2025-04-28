const prisma = require('../../config/prismaClient');
const audit  = require('../../utils/audit');

/* GET /admin/courses/:id/students */
async function list(req,res){
  const courseId = +req.params.id;
  const students = await prisma.courseStudent.findMany({
    where:{ courseId }, include:{ student:true }
  });
  res.json(students);
}

/* POST /admin/courses/:id/students  body:{ studentIds:[…] } */
async function enroll(req,res){
  const courseId = +req.params.id;
  const { studentIds } = req.body;
  await prisma.courseStudent.createMany({
    data: studentIds.map(sid=>({ courseId, studentId:sid })), skipDuplicates:true
  });
  audit(req.user.id,'ENROLL_STUDENTS',{ courseId, studentIds });
  res.json({ success:true });
}

/* DELETE /admin/courses/:id/students/:sid */
async function remove(req,res){
  const courseId = +req.params.id;
  const studentId = +req.params.sid;
  await prisma.courseStudent.delete({
    where:{ courseId_studentId:{ courseId, studentId } }
  });
  audit(req.user.id,'REMOVE_STUDENT',{ courseId, studentId });
  res.json({ success:true });
}

module.exports = { list, enroll, remove };
