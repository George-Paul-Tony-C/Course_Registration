const prisma = require('../../config/prismaClient');
const audit  = require('../../utils/audit');

/* POST /admin/courses/:id/faculty  (replace list) */
async function assign(req,res){
  const courseId = +req.params.id;
  const { facultyIds } = req.body;          // [Int]
  await prisma.$transaction([
    prisma.courseFaculty.deleteMany({ where:{ courseId } }),
    prisma.courseFaculty.createMany({
      data: facultyIds.map(fid=>({ courseId, facultyId:fid })), skipDuplicates:true
    })
  ]);
  audit(req.user.id,'ASSIGN_FACULTY',{ courseId, facultyIds });
  res.json({ success:true });
}

/* GET /admin/courses/:id/faculty */
async function list(req,res){
  const courseId = +req.params.id;
  const list = await prisma.courseFaculty.findMany({
    where:{ courseId }, include:{ faculty:true }
  });
  res.json(list);
}

/* DELETE /admin/courses/:id/faculty/:fid */
async function remove(req,res){
  const courseId = +req.params.id;
  const facultyId = +req.params.fid;
  await prisma.courseFaculty.delete({
    where:{ courseId_facultyId:{ courseId, facultyId } }
  });
  audit(req.user.id,'REMOVE_FACULTY',{ courseId, facultyId });
  res.json({ success:true });
}

module.exports = { assign, list, remove };
