const prisma = require('../../config/prismaClient');
const audit  = require('../../utils/audit');

/* GET /admin/courses */
async function list(req,res){
  const { status } = req.query;
  const courses = await prisma.course.findMany({
    where  : status ? { status } : undefined,
    include: { faculty:{ include:{ faculty:true } },
               students:{ include:{ student:true } } }
  });
  res.json(courses);
}

/* POST /admin/courses */
async function create(req,res){
  const { code,title,description } = req.body;
  const course = await prisma.course.create({
    data:{ code,title,description, createdById:req.user.id }
  });
  audit(req.user.id,'CREATE_COURSE',{ courseId:course.id });
  res.status(201).json(course);
}

/* PATCH /admin/courses/:id */
async function update(req,res){
  const id = +req.params.id;
  const { title,description,status } = req.body;
  const course = await prisma.course.update({
    where:{ id }, data:{ title,description,status }
  });
  audit(req.user.id,'UPDATE_COURSE',{ courseId:id });
  res.json(course);
}

/* DELETE /admin/courses/:id  -> sets ARCHIVED & isDeleted */
async function remove(req,res){
  const id = +req.params.id;
  await prisma.course.update({
    where:{ id }, data:{ status:'ARCHIVED', isDeleted:true }
  });
  audit(req.user.id,'ARCHIVE_COURSE',{ courseId:id });
  res.json({ success:true });
}

module.exports = { list, create, update, remove };
