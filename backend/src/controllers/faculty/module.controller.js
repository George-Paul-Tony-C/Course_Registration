// controllers/faculty/module.controller.js
const prisma = require('../../config/prismaClient');

/**
 * Create a new module for a course
 * @route POST /api/faculty/courses/modules
 */
exports.createModule = async (req, res) => {
  try {
    const { title, course_id } = req.body;
    const facultyId = req.user.id;

    if (!title || !course_id) {
      return res.status(400).json({
        success: false,
        message: 'Module title and course ID are required'
      });
    }

    // Check if the course exists and faculty is assigned to it
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(course_id),
        is_deleted: false,
        faculties: {
          some: {
            faculty_id: facultyId
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

    // Create the module
    const module = await prisma.$transaction(async (prismaClient) => {
      const newModule = await prismaClient.module.create({
        data: {
          title,
          course_id: parseInt(course_id),
          faculty_id: facultyId
        }
      });

      // Log this action
      await prismaClient.auditLog.create({
        data: {
          actor_id: facultyId,
          action: 'CREATE_MODULE',
          details_json: {
            module_id: newModule.id,
            module_title: title,
            course_id: parseInt(course_id)
          }
        }
      });

      return newModule;
    });

    return res.status(201).json({
      success: true,
      message: 'Module created successfully',
      data: module
    });
  } catch (error) {
    console.error('Create module error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create module',
      error: error.message
    });
  }
};

/**
 * List all modules for a course
 * @route GET /api/faculty/courses/:courseId/modules
 */
exports.listModules = async (req, res) => {
  try {
    const { courseId } = req.params;
    const facultyId = req.user.id;

    // Check if the course exists and faculty is assigned to it
    const course = await prisma.course.findFirst({
      where: {
        id: parseInt(courseId),
        is_deleted: false,
        faculties: {
          some: {
            faculty_id: facultyId
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

    // Get all modules for the course
    const modules = await prisma.module.findMany({
      where: {
        course_id: parseInt(courseId)
      },
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
          },
          orderBy: {
            display_order: 'asc'
          }
        }
      },
      orderBy: {
        created_at: 'asc'
      }
    });

    // Format the response
    const formattedModules = modules.map(module => ({
      id: module.id,
      title: module.title,
      createdAt: module.created_at,
      updatedAt: module.updated_at,
      contents: module.contents.map(content => ({
        id: content.id,
        title: content.title,
        type: content.type,
        displayOrder: content.display_order,
        file: content.file,
        youtubeUrl: content.youtube_url
      }))
    }));

    return res.status(200).json({
      success: true,
      data: formattedModules
    });
  } catch (error) {
    console.error('List modules error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve modules',
      error: error.message
    });
  }
};

/**
 * Update a module
 * @route PATCH /api/faculty/modules/:moduleId
 */
exports.updateModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { title } = req.body;
    const facultyId = req.user.id;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Module title is required'
      });
    }

    // Check if the module exists and belongs to the faculty
    const existingModule = await prisma.module.findFirst({
      where: {
        id: parseInt(moduleId),
        faculty_id: facultyId
      },
      include: {
        course: {
          select: {
            is_deleted: true
          }
        }
      }
    });

    if (!existingModule) {
      return res.status(404).json({
        success: false,
        message: 'Module not found or you do not have access'
      });
    }

    if (existingModule.course.is_deleted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update module in a deleted course'
      });
    }

    // Update the module
    const updatedModule = await prisma.$transaction(async (prismaClient) => {
      const module = await prismaClient.module.update({
        where: { id: parseInt(moduleId) },
        data: { title }
      });

      // Log this action
      await prismaClient.auditLog.create({
        data: {
          actor_id: facultyId,
          action: 'UPDATE_MODULE',
          details_json: {
            module_id: parseInt(moduleId),
            module_title: title
          }
        }
      });

      return module;
    });

    return res.status(200).json({
      success: true,
      message: 'Module updated successfully',
      data: updatedModule
    });
  } catch (error) {
    console.error('Update module error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update module',
      error: error.message
    });
  }
};

/**
 * Delete a module
 * @route DELETE /api/faculty/modules/:moduleId
 */
exports.deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const facultyId = req.user.id;

    // Check if the module exists and belongs to the faculty
    const existingModule = await prisma.module.findFirst({
      where: {
        id: parseInt(moduleId),
        faculty_id: facultyId
      },
      include: {
        course: {
          select: {
            is_deleted: true
          }
        }
      }
    });

    if (!existingModule) {
      return res.status(404).json({
        success: false,
        message: 'Module not found or you do not have access'
      });
    }

    if (existingModule.course.is_deleted) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete module in a deleted course'
      });
    }

    // Delete the module (and associated contents due to cascade)
    await prisma.$transaction(async (prismaClient) => {
      // First get all content IDs to log them
      const contents = await prismaClient.content.findMany({
        where: {
          module_id: parseInt(moduleId)
        },
        select: {
          id: true,
          file_id: true
        }
      });

      // Delete the module (which will cascade delete contents)
      await prismaClient.module.delete({
        where: { id: parseInt(moduleId) }
      });

      // Log this action
      await prismaClient.auditLog.create({
        data: {
          actor_id: facultyId,
          action: 'DELETE_MODULE',
          details_json: {
            module_id: parseInt(moduleId),
            module_title: existingModule.title,
            deleted_content_ids: contents.map(c => c.id),
            deleted_file_ids: contents.filter(c => c.file_id).map(c => c.file_id)
          }
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: 'Module deleted successfully'
    });
  } catch (error) {
    console.error('Delete module error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete module',
      error: error.message
    });
  }
};