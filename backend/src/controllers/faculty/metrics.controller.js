const prisma = require('../../config/prismaClient');

// Get course statistics (e.g., top-performing courses)
exports.getCourseStats = async (req, res) => {
  try {
    const stats = await prisma.course.aggregate({
      _count: {
        students: true,
      },
      _avg: {
        quizzes: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Course statistics fetched successfully',
      data: stats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch course statistics',
      error: error.message,
    });
  }
};

// Get student statistics (e.g., engagement, performance)
exports.getStudentStats = async (req, res) => {
  try {
    const stats = await prisma.user.aggregate({
      _count: {
        quizzes: true,
      },
      _avg: {
        scores: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Student statistics fetched successfully',
      data: stats,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch student statistics',
      error: error.message,
    });
  }
};
