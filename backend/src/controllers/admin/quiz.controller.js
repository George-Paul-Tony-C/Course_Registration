const prisma = require('../../config/prismaClient');

/* GET /admin/quizzes?courseId=…  (omit for ALL) */
async function list(req,res){
  const { courseId } = req.query;
  const where = courseId ? { courseId:+courseId } : {};
  const quizzes = await prisma.quiz.findMany({
    where,
    include:{
      _count:{ select:{ questions:true, attempts:true } },
      attempts:{
        select:{ score:true },
        orderBy:{ attemptedAt:'desc' },
        take:10        // last 10 scores quick peek
      }
    }
  });
  res.json(quizzes);
}

module.exports = { list };
