// controllers/faculty/course.controller.js
const prisma = require('../../config/prismaClient');

/**
 * Create a new course
 * @route POST /api/faculty/courses
 */
exports.createCourse = async (req, res) => {
  try {
    const { code, title, description } = req.body;
    const facultyId = req.user.id;

    if (!code || !title) {
      return res.status(400).json({
        success: false,
        message: 'Course code and title are required'
      });
    }

    // Check if course code already exists
    const existingCourse = await prisma.course.findUnique({
      where: { code }
    });

    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: 'Course with this code already exists'
      });
    }

    // Create course and assign faculty in a transaction
    const course = await prisma.$transaction(async (prismaClient) => {
      // Create the course
      const newCourse = await prismaClient.course.create({
        data: {
          code,
          title,
          description,
          created_by: facultyId,
          status: 'PENDING'
        }
      });

      // Assign faculty to course
      await prismaClient.courseFaculty.create({
        data: {
          course_id: newCourse.id,
          faculty_id: facultyId
        }
      });

      // Log this action
      await prismaClient.auditLog.create({
        data: {
          actor_id: facultyId,
          action: 'CREATE_COURSE',
          details_json: {
            course_id: newCourse.id,
            course_code: code,
            course_title: title
          }
        }
      });

      return newCourse;
    });

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
};

/**
 * List all courses assigned to faculty
 * @route GET /api/faculty/courses
 */
exports.listCourses = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { status } = req.query;

    // Build filter conditions
    const whereCondition = {
      faculties: {
        some: {
          faculty_id: facultyId,
          
        }
      },
      is_deleted: false
    };

    // Add status filter if provided
    if (status && ['PENDING', 'ACTIVE', 'ARCHIVED'].includes(status)) {
      whereCondition.status = status;
    }

    // Get courses with student count
    const courses = await prisma.course.findMany({
      where: whereCondition,
      include: {
        _count: {
          select: {
            students: true
          }
        },
        modules: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });


    // Format the response
    const formattedCourses = courses.map(course => ({
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description,
      status: course.status,
      studentCount: course._count.students,
      moduleCount: course.modules.length,
      created_by: course.created_by,
      createdAt: course.created_at
    }));

    return res.status(200).json({
      success: true,
      data: formattedCourses
    });
  } catch (error) {
    console.error('List courses error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve courses',
      error: error.message
    });
  }
};

/**
 * Get course details by ID
 * @route GET /api/faculty/courses/:id
 */
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyId = req.user.id;

    // Check if the course exists and faculty is assigned to it
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(id),
        is_deleted: false,
        faculties: {
          some: {
            faculty_id: facultyId
          }
        }
      },
      include: {
        modules: {
          include: {
            contents: {
              include: {
                file: {
                  select: {
                    id: true,
                    original_name: true,
                    mime_type: true,
                    size_bytes: true
                  }
                }
              }
            }
          }
        },
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
        },
        quizzes: {
          select: {
            id: true,
            title: true,
            total_marks: true,
            due_date: true,
            _count: {
              select: {
                attempts: true
              }
            }
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have access'
      });
    }

    // Format the response
    const formattedCourse = {
      id: course.id,
      code: course.code,
      title: course.title,
      description: course.description,
      status: course.status,
      createdAt: course.created_at,
      updatedAt: course.updated_at,
      modules: course.modules.map(module => ({
        id: module.id,
        title: module.title,
        contentCount: module.contents.length,
        contents: module.contents.map(content => ({
          id: content.id,
          title: content.title,
          type: content.type,
          displayOrder: content.display_order,
          file: content.file,
          youtubeUrl: content.youtube_url
        }))
      })),
      students: course.students.map(cs => ({
        id: cs.student.id,
        username: cs.student.username,
        email: cs.student.email,
        enrolledAt: cs.enrolled_at
      })),
      quizzes: course.quizzes.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        totalMarks: quiz.total_marks,
        dueDate: quiz.due_date,
        attemptCount: quiz._count.attempts
      }))
    };

    return res.status(200).json({
      success: true,
      data: formattedCourse
    });
  } catch (error) {
    console.error('Get course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve course',
      error: error.message
    });
  }
};

/**
 * Update course details
 * @route PATCH /api/faculty/courses/:id
 */
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const facultyId = req.user.id;

    // Check if the course exists and faculty is assigned to it
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: parseInt(id),
        is_deleted: false,
        faculties: {
          some: {
            faculty_id: facultyId
          }
        }
      }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have access'
      });
    }

    // Prepare update data
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;


    // Update the course
    const updatedCourse = await prisma.$transaction(async (prismaClient) => {
      const course = await prismaClient.course.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      // Log this action
      await prismaClient.auditLog.create({
        data: {
          actor_id: facultyId,
          action: 'UPDATE_COURSE',
          details_json: {
            course_id: parseInt(id),
            updates: updateData
          }
        }
      });

      return course;
    });

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
  }
};

/**
 * Delete a course (soft delete)
 * @route DELETE /api/faculty/courses/:id
 */
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyId = req.user.id;

    // Check if the course exists and faculty is assigned to it
    const existingCourse = await prisma.course.findFirst({
      where: {
        id: parseInt(id),
        is_deleted: false,
        faculties: {
          some: {
            faculty_id: facultyId
          }
        }
      }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have access'
      });
    }

    // Soft delete the course
    await prisma.$transaction(async (prismaClient) => {
      await prismaClient.course.update({
        where: { id: parseInt(id) },
        data: { 
          is_deleted: true,
          status: 'ARCHIVED' 
        }
      });

      // Log this action
      await prismaClient.auditLog.create({
        data: {
          actor_id: facultyId,
          action: 'DELETE_COURSE',
          details_json: {
            course_id: parseInt(id),
            course_code: existingCourse.code,
            course_title: existingCourse.title
          }
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
};