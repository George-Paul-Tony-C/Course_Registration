const prisma = require('../../config/prismaClient');

// Get course performance (average score)
exports.getCoursePerformance = async (req, res) => {
  const { id } = req.params; // Course ID

  try {
    const performance = await prisma.quizAttempt.aggregate({
      where: { course_id: parseInt(id, 10) },
      _avg: { score: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Course performance fetched successfully',
      data: performance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch course performance',
      error: error.message,
    });
  }
};

// Get student performance (average score in quizzes)
exports.getStudentPerformance = async (req, res) => {
  const { id } = req.params; // Course ID

  try {
    const performance = await prisma.quizAttempt.aggregate({
      where: { course_id: parseInt(id, 10) },
      _avg: { score: true },
      _count: { id: true },
    });

    return res.status(200).json({
      success: true,
      message: 'Student performance fetched successfully',
      data: performance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch student performance',
      error: error.message,
    });
  }
};
