const prisma = require('../../config/prismaClient');

/* GET /admin/metrics */
async function dashboard(req,res){
  // total counts
  const [totalStudents, totalFaculty] = await Promise.all([
    prisma.user.count({ where:{ role:'STUDENT', isDeleted:false } }),
    prisma.user.count({ where:{ role:'FACULTY', isDeleted:false } })
  ]);

  // active = users with refresh-token that expires in future
  const activeUsers = await prisma.refreshToken.count({
    where:{ expiresAt:{ gt:new Date() } },
    distinct:['userId']
  });

  // trending courses: by enrolments + avg quiz score
  const trending = await prisma.course.groupBy({
    by:['id','code','title'],
    _count:{ students:true },
    _avg :{ quizzes:{ select:{ attempts:{ select:{ score:true } } } } },
    orderBy:{ _count:{ students:'desc' } },
    take:5
  });

  res.json({
    totals :{ students:totalStudents, faculty:totalFaculty },
    activeUsers,
    trendingCourses: trending.map(t=>({
      id:t.id, code:t.code, title:t.title,
      enrolled:t._count.students,
      avgScore: t._avg.quizzes?.attempts?.score ?? null
    }))
  });
}

module.exports = { dashboard };
