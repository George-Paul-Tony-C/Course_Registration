// controllers/faculty/dashboard.controller.js
const prisma = require('../../config/prismaClient');

/**
 * Get faculty dashboard data
 * @route GET /api/faculty/dashboard
 */
exports.dashboard = async (req, res) => {
  try {
    const facultyId = req.user.id;

    // 1) Fetch all non-deleted courses assigned to this faculty
    const courses = await prisma.course.findMany({
      where: {
        is_deleted: false,
        faculties: {
          some: { faculty_id: facultyId }
        }
      },
      include: {
        // brings in CourseStudent[] as `students`
        students: {
          include: {
            student: {
              select: {
                id: true,
                username: true,
                email: true
              }
            }
          }
        }
      }
    });

    // 2) Get recent quizzes created by this faculty
    const recentQuizzes = await prisma.quiz.findMany({
      where: {
        course: {
          faculties: {
            some: { faculty_id: facultyId }
          }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 5,
      include: {
        course: {
          select: { title: true, code: true }
        }
      }
    });

    // 3) Get module count for this faculty
    const moduleCount = await prisma.module.count({
      where: { faculty_id: facultyId }
    });

    // 4) Get upcoming quizzes (due in future)
    const upcomingQuizzes = await prisma.quiz.findMany({
      where: {
        course: {
          faculties: {
            some: { faculty_id: facultyId }
          }
        },
        due_date: { gte: new Date() }
      },
      orderBy: { due_date: 'asc' },
      take: 5,
      include: {
        course: {
          select: { title: true, code: true }
        }
      }
    });

    // 5) Get recent uncompleted todo items
    const todoItems = await prisma.todoList.findMany({
      where: {
        user_id: facultyId,
        is_completed: false
      },
      orderBy: [
        { due_date: 'asc' },
        { priority: 'desc' }
      ],
      take: 5
    });

    // 6) Assemble dashboard data
    const dashboardData = {
      courseCount: courses.length,
      moduleCount,
      recentQuizzes,
      upcomingQuizzes,
      todoItems,
      courses: courses.map(c => ({
        id: c.id,
        code: c.code,
        title: c.title,
        description: c.description,
        status: c.status,
        studentCount: c.students.length
      }))
    };

    return res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data',
      error: error.message
    });
  }
};
