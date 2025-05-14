// src/controllers/metrix.controller.js
const prisma = require('../../config/prismaClient');

/* ------------------------------------------------------------------ *
 * 1)  GET /admin/dashboard/stats
 * ------------------------------------------------------------------ */
async function getDashboardStats(req, res) {
  try {
    const [
      totalCourses,
      activeCourses,
      archivedCourses,
      totalStudents,
      totalFaculty,
    ] = await Promise.all([
      prisma.course.count({ where: { is_deleted: false } }),
      prisma.course.count({
        where: { status: 'ACTIVE', is_deleted: false },
      }),
      prisma.course.count({
        where: { status: 'ARCHIVED', is_deleted: false },
      }),
      prisma.user.count({
        where: { role: 'STUDENT', is_deleted: false },
      }),
      prisma.user.count({
        where: { role: 'FACULTY', is_deleted: false },
      }),
    ]);

    return res.json({
      totalCourses,
      activeCourses,
      archivedCourses,
      totalStudents,
      totalFaculty,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Unable to fetch dashboard stats' });
  }
}


/* ────────────────────────────────────────────────────────────────── */
/* 2)  Last 20 audit-log entries                                     */
/* ────────────────────────────────────────────────────────────────── */
async function getRecentActivities(req, res) {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { logged_at: 'desc' },
      take: 20,
      include: {
        actor: { select: { username: true } },
      },
    });

    const activities = logs.map((l) => {
      let type = 'misc';
      if (l.action.startsWith('course')) type = 'course';
      else if (l.action.startsWith('student')) type = 'student';
      else if (l.action.startsWith('faculty')) type = 'faculty';

      return {
        id: l.id,
        type,
        action: l.action,
        title:
          l.details_json?.title || l.details_json?.name || 'Untitled record',
        user: l.actor?.username || 'System',
        timestamp: l.logged_at,
      };
    });

    res.json(activities);
  } catch (err) {
    console.error('Activity error:', err);
    res.status(500).json({ message: 'Unable to fetch recent activity' });
  }
}

/* ────────────────────────────────────────────────────────────────── */
/* 3)  Top-5 “trending” courses by enrolments                         */
/*     — fixed: uses .findMany + _count instead of faulty groupBy     */
/* ────────────────────────────────────────────────────────────────── */
async function getTrendingCourses(req, res) {
  try {
    const courses = await prisma.course.findMany({
      where: { is_deleted: false },
      select: {
        id: true,
        code: true,
        title: true,
        _count: { select: { students: true } },
      },
      orderBy: { students: { _count: 'desc' } },
      take: 5,
    });

    res.json(
      courses.map((c) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        enrolled: c._count.students,
      }))
    );
  } catch (err) {
    console.error('Trending error:', err);
    res.status(500).json({ message: 'Unable to fetch trending courses' });
  }
}

/* ────────────────────────────────────────────────────────────────── */
/* 4)  Enrollment trend — daily counts for the last 30 days (NEW)     */
/* ────────────────────────────────────────────────────────────────── */
// controllers/admin/metrics.controller.js  (excerpt)

async function getEnrollmentTrend(req, res) {
  const days = parseInt(req.query.days, 10) || 30;

  try {
    /*  NOTE:
     *  - table name = `CourseStudent` (model name, because no @@map)
     *  - COUNT(*) comes back as BigInt in MySQL 8 → convert to Number()
     */
    const rows = await prisma.$queryRaw`
      SELECT DATE(enrolled_at) AS day,
             COUNT(*)          AS cnt
      FROM   CourseStudent
      WHERE  enrolled_at >= DATE_SUB(CURDATE(), INTERVAL ${days} DAY)
      GROUP  BY day
      ORDER  BY day ASC;`;

    const data = rows.map(r => ({
      day:   r.day,                 // '2025-04-01'
      count: Number(r.cnt),         // BigInt → number
    }));

    res.json(data);
  } catch (err) {
    console.error('Enrollment trend error:', err);
    res.status(500).json({ message: 'Unable to fetch enrollment trend data' });
  }
}


/* ────────────────────────────────────────────────────────────────── */
/* 5)  Quiz performance — average score by course (NEW)               */
/* ────────────────────────────────────────────────────────────────── */
async function getQuizPerformance(req, res) {
  try {
    const perf = await prisma.quizAttempt.groupBy({
      by: ['quiz_id'],
      _avg: { score: true },
      _count: { _all: true },
      orderBy: { _avg: { score: 'desc' } },
      take: 10,
    });

    // Join with Quiz + Course to return friendly names
    const detailed = await Promise.all(
      perf.map(async (q) => {
        const quiz = await prisma.quiz.findUnique({
          where: { id: q.quiz_id },
          select: {
            id: true,
            title: true,
            course: { select: { code: true, title: true } },
          },
        });

        return {
          quizId: quiz.id,
          quizTitle: quiz.title,
          courseCode: quiz.course.code,
          courseTitle: quiz.course.title,
          avgScore: q._avg.score,
          attempts: q._count._all,
        };
      })
    );

    res.json(detailed);
  } catch (err) {
    console.error('Quiz performance error:', err);
    res.status(500).json({ message: 'Unable to fetch quiz performance' });
  }
}

/* ────────────────────────────────────────────────────────────────── */
module.exports = {
  getDashboardStats,
  getRecentActivities,
  getTrendingCourses,
  getEnrollmentTrend,
  getQuizPerformance,
};
