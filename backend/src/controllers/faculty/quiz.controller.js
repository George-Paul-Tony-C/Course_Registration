// src/controllers/faculty/quiz.controller.js
const prisma = require('../../config/prismaClient');

/**
 * Create a new quiz for a module
 * @route POST /api/faculty/modules/:moduleId/quizzes
 */
exports.createQuiz = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title, total_marks, due_date, questions } = req.body;
    const facultyId = req.user.id;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Quiz title is required' });
    }

    // 1) Fetch module and its course
    const module = await prisma.module.findUnique({
      where: { id: parseInt(moduleId, 10) },
      include: {
        course: {
          select: { id: true, is_deleted: true }
        }
      }
    });

    // 2) Authorization & soft-delete checks
    if (!module || module.faculty_id !== facultyId) {
      return res
        .status(404)
        .json({ success: false, message: 'Module not found or access denied' });
    }
    if (module.course.is_deleted) {
      return res
        .status(400)
        .json({ success: false, message: 'Cannot add a quiz to a deleted course' });
    }

    // 3) Validate questions array if present
    if (questions && !Array.isArray(questions)) {
      return res
        .status(400)
        .json({ success: false, message: 'Questions must be an array' });
    }

    // 4) Create quiz, questions, and content all in one transaction
    const quiz = await prisma.$transaction(async (tx) => {
      // a) Create the quiz record
      const newQuiz = await tx.quiz.create({
        data: {
          course_id:    module.course.id,
          title,
          total_marks:  total_marks || 0,
          due_date:     due_date ? new Date(due_date) : null
        }
      });

      // b) Insert questions (if any)
      if (Array.isArray(questions) && questions.length > 0) {
        await Promise.all(
          questions.map((q) => {
            if (!q.question_text || !q.options || q.correct_option == null) {
              throw new Error(
                'Each question needs question_text, options, and correct_option'
              );
            }
            const opts =
              typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
            return tx.quizQuestion.create({
              data: {
                quiz_id:        newQuiz.id,
                question_text:  q.question_text,
                options_json:   opts,
                correct_option: parseInt(q.correct_option, 10)
              }
            });
          })
        );
      }

      // c) Create a content item of type QUIZ under this module
      await tx.content.create({
        data: {
          module_id:     parseInt(moduleId, 10),
          title,
          type:          'QUIZ',
          quiz_id:       newQuiz.id,
          display_order: 0
        }
      });

      // d) Audit log
      await tx.auditLog.create({
        data: {
          actor_id: facultyId,
          action:   'CREATE_QUIZ',
          details_json: {
            quiz_id:        newQuiz.id,
            module_id:      parseInt(moduleId, 10),
            question_count: Array.isArray(questions) ? questions.length : 0
          }
        }
      });

      return newQuiz;
    });

    return res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data:    quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create quiz',
      error:   error.message
    });
  }
};

/**
 * List all quizzes for a course
 * @route GET /api/faculty/courses/:id/quizzes
 */
exports.listQuizzes = async (req, res) => {
  try {
    const { id } = req.params; // Course ID
    const facultyId = req.user.id;

    // Verify faculty assignment
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(id, 10),
        is_deleted: false,
        faculties: {
          some: { faculty_id: facultyId }
        }
      }
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or access denied'
      });
    }

    // Fetch quizzes
    const quizzes = await prisma.quiz.findMany({
      where: { course_id: parseInt(id, 10) },
      include: {
        _count: { select: { questions: true, attempts: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    const formatted = quizzes.map((q) => ({
      id:           q.id,
      title:        q.title,
      totalMarks:   q.total_marks,
      dueDate:      q.due_date,
      createdAt:    q.created_at,
      updatedAt:    q.updated_at,
      questionCount:q._count.questions,
      attemptCount: q._count.attempts
    }));

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error('List quizzes error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve quizzes',
      error:   error.message
    });
  }
};

/**
 * Get quiz details (with questions & attempts)
 * @route GET /api/faculty/courses/:id/quizzes/:quizId
 */
exports.getQuizDetails = async (req, res) => {
  try {
    const { id, quizId } = req.params;
    const facultyId = req.user.id;

    // Verify faculty assignment
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(id, 10),
        is_deleted: false,
        faculties: { some: { faculty_id: facultyId } }
      }
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or access denied'
      });
    }

    // Fetch quiz
    const quiz = await prisma.quiz.findFirst({
      where: {
        id:         parseInt(quizId, 10),
        course_id:  parseInt(id, 10)
      },
      include: {
        questions: true,
        attempts: {
          include: {
            student: { select: { id: true, username: true, email: true } }
          },
          orderBy: { attempted_at: 'desc' }
        }
      }
    });
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const formatted = {
      id:           quiz.id,
      title:        quiz.title,
      totalMarks:   quiz.total_marks,
      dueDate:      quiz.due_date,
      createdAt:    quiz.created_at,
      updatedAt:    quiz.updated_at,
      questions:    quiz.questions.map((q) => ({
        id:            q.id,
        questionText:  q.question_text,
        options:       q.options_json,
        correctOption: q.correct_option
      })),
      attempts:     quiz.attempts.map((a) => ({
        id:          a.id,
        student:     a.student,
        score:       a.score,
        attemptedAt: a.attempted_at
      }))
    };

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error('Get quiz details error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve quiz details',
      error:   error.message
    });
  }
};

/**
 * Update quiz details & questions
 * @route PATCH /api/faculty/courses/:id/quizzes/:quizId
 */
exports.updateQuiz = async (req, res) => {
  try {
    const { id, quizId } = req.params;
    const { title, total_marks, due_date, questions } = req.body;
    const facultyId = req.user.id;

    // Verify faculty assignment
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(id, 10),
        is_deleted: false,
        faculties: { some: { faculty_id: facultyId } }
      }
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or access denied'
      });
    }

    // Verify quiz
    const existing = await prisma.quiz.findFirst({
      where: {
        id:        parseInt(quizId, 10),
        course_id: parseInt(id, 10)
      }
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found in this course'
      });
    }

    // Validate questions array
    if (questions && !Array.isArray(questions)) {
      return res
        .status(400)
        .json({ success: false, message: 'Questions must be an array' });
    }

    // Transaction: update quiz + questions + audit
    const updated = await prisma.$transaction(async (tx) => {
      const data = {};
      if (title)      data.title       = title;
      if (total_marks !== undefined) data.total_marks = total_marks;
      if (due_date !== undefined)    data.due_date    = due_date ? new Date(due_date) : null;

      const quiz = await tx.quiz.update({
        where: { id: parseInt(quizId, 10) },
        data
      });

      if (Array.isArray(questions)) {
        await tx.quizQuestion.deleteMany({ where: { quiz_id: quiz.id } });
        await Promise.all(
          questions.map((q) => {
            if (!q.question_text || !q.options || q.correct_option == null) {
              throw new Error(
                'Each question must have question_text, options, and correct_option'
              );
            }
            const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
            return tx.quizQuestion.create({
              data: {
                quiz_id:        quiz.id,
                question_text:  q.question_text,
                options_json:   opts,
                correct_option: parseInt(q.correct_option, 10)
              }
            });
          })
        );
      }

      await tx.auditLog.create({
        data: {
          actor_id: facultyId,
          action:   'UPDATE_QUIZ',
          details_json: {
            quiz_id:         quiz.id,
            course_id:       parseInt(id, 10),
            updates:         data,
            questions_count: Array.isArray(questions) ? questions.length : 0
          }
        }
      });

      return quiz;
    });

    return res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data:    updated
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update quiz',
      error:   error.message
    });
  }
};

/**
 * Delete a quiz (only if no attempts)
 * @route DELETE /api/faculty/courses/:id/quizzes/:quizId
 */
exports.deleteQuiz = async (req, res) => {
  try {
    const { id, quizId } = req.params;
    const facultyId = req.user.id;

    // Verify faculty assignment
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(id, 10),
        is_deleted: false,
        faculties: { some: { faculty_id: facultyId } }
      }
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or access denied'
      });
    }

    // Verify quiz and count attempts
    const existing = await prisma.quiz.findFirst({
      where: {
        id:        parseInt(quizId, 10),
        course_id: parseInt(id, 10)
      },
      include: {
        _count: { select: { attempts: true } }
      }
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found in this course'
      });
    }
    if (existing._count.attempts > 0) {
      return res.status(409).json({
        success: false,
        message: `Cannot delete quiz with ${existing._count.attempts} existing attempts`,
        suggestArchive: true
      });
    }

    // Delete quiz + audit
    await prisma.$transaction(async (tx) => {
      await tx.quiz.delete({ where: { id: existing.id } });
      await tx.auditLog.create({
        data: {
          actor_id: facultyId,
          action:   'DELETE_QUIZ',
          details_json: {
            quiz_id:   existing.id,
            course_id: parseInt(id, 10),
            quiz_title: existing.title
          }
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete quiz',
      error:   error.message
    });
  }
};


/**
 * Archive a quiz (soft delete)
 * @route DELETE /api/faculty/courses/:id/quizQuestion/:quizQuestionId/
 */ 

exports.deleteQuizQuestion = async (req, res) => {
  try {
    
    const { id , quizQuestionId } = req.params;
    const facultyId = req.user.id;

    // Verify faculty assignment
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(id, 10),
        is_deleted: false,
        faculties: { some: { faculty_id: facultyId } }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or access denied'
      });
    }

    // Verify quiz question
    const existing = await prisma.quizQuestion.findFirst({
      where: {
        id: parseInt(quizQuestionId, 10),
        quiz: { course_id: parseInt(id, 10) }
      }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Quiz question not found in this course'
      });
    }

    // Permanently delete the quiz question
    await prisma.quizQuestion.delete({
      where: { id: existing.id },
    });

    return res.status(200).json({
      success: true,
      message: 'Quiz question deleted successfully',
    });



  } catch (error) {
    console.error('Delete quiz error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete quiz question',
      error:   error.message
    });
  }
}