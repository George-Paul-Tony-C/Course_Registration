// controllers/faculty/content.controller.js
const prisma = require('../../config/prismaClient');

/**
 * Add content to a module
 * @route POST /api/faculty/modules/content
 */
exports.addContent = async (req, res) => {
  try {
    const { module_id, title, type, file_id, quiz_id, youtube_url, display_order } = req.body;
    const facultyId = req.user.id;

    if (!module_id || !title || !type) {
      return res.status(400).json({
        success: false,
        message: 'Module ID, title, and content type are required'
      });
    }

    // Validate content type
    const validContentTypes = ['IMAGE', 'PDF', 'VIDEO', 'PPTX', 'QUIZ', 'OTHER'];
    if (!validContentTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Content type must be one of: ${validContentTypes.join(', ')}`
      });
    }

    // Video needs youtube_url
    if (type === 'VIDEO' && !youtube_url) {
      return res.status(400).json({
        success: false,
        message: 'YouTube URL is required for video content'
      });
    }

    // Quiz needs quiz_id
    if (type === 'QUIZ' && !quiz_id) {
      return res.status(400).json({
        success: false,
        message: 'quiz_id is required for quiz content'
      });
    }

    // Non-video, non-quiz needs file_id
    if (!['VIDEO','QUIZ'].includes(type) && !file_id) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required for non-video, non-quiz content'
      });
    }

    // Check module & course
    const module = await prisma.module.findFirst({
      where: { id: +module_id, faculty_id: facultyId },
      include: { course: { select: { is_deleted: true } } }
    });
    if (!module) {
      return res.status(404).json({ success:false, message:'Module not found or access denied' });
    }
    if (module.course.is_deleted) {
      return res.status(400).json({ success:false, message:'Cannot add content to a deleted course' });
    }

    // Validate file or quiz existence
    if (file_id) {
      const file = await prisma.file.findUnique({ where:{ id:+file_id } });
      if (!file) return res.status(404).json({ success:false, message:'File not found' });
    }
    if (quiz_id) {
      const quiz = await prisma.quiz.findFirst({
        where: {
          id: +quiz_id,
          course_id: module.course.id
        }
      });
      if (!quiz) return res.status(404).json({ success:false, message:'Quiz not found in this course' });
    }

    // Create content
    const content = await prisma.$transaction(async tx => {
      let orderValue = display_order;
      if (orderValue === undefined) {
        const maxC = await tx.content.findFirst({
          where:{ module_id:+module_id },
          orderBy:{ display_order:'desc' }
        });
        orderValue = maxC ? maxC.display_order + 1 : 0;
      }

      const newContent = await tx.content.create({
        data: {
          module_id: +module_id,
          title,
          type,
          file_id: file_id ? +file_id : null,
          quiz_id: quiz_id ? +quiz_id : null,
          youtube_url,
          display_order: orderValue
        }
      });

      await tx.auditLog.create({
        data:{
          actor_id: facultyId,
          action: 'ADD_CONTENT',
          details_json:{ content_id:newContent.id, module_id:+module_id, content_type:type }
        }
      });

      return newContent;
    });

    return res.status(201).json({ success:true, message:'Content added successfully', data:content });
  } catch(error) {
    console.error('Add content error:', error);
    return res.status(500).json({ success:false, message:'Failed to add content', error:error.message });
  }
};

/**
 * Update content
 * @route PATCH /api/faculty/modules/:moduleId/content/:contentId
 */
exports.updateContent = async (req, res) => {
  try {
    const { moduleId, contentId } = req.params;
    const { title, file_id, youtube_url, display_order } = req.body;
    const facultyId = req.user.id;

    // Check module ownership and course status
    const module = await prisma.module.findFirst({
      where: {
        id: parseInt(moduleId),
        faculty_id: facultyId
      },
      include: { course: { select: { is_deleted: true } } }
    });
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found or access denied' });
    }
    if (module.course.is_deleted) {
      return res.status(400).json({ success: false, message: 'Cannot update content in a deleted course' });
    }

    // Check content exists
    const existing = await prisma.content.findFirst({
      where: { id: parseInt(contentId), module_id: parseInt(moduleId) }
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Content not found in this module' });
    }

    // If swapping file_id, ensure file exists
    if (file_id) {
      const file = await prisma.file.findUnique({ where: { id: parseInt(file_id) } });
      if (!file) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const upd = await tx.content.update({
        where: { id: parseInt(contentId) },
        data: {
          title: title ?? existing.title,
          file_id: file_id !== undefined ? parseInt(file_id) : existing.file_id,
          youtube_url: youtube_url !== undefined ? youtube_url : existing.youtube_url,
          display_order: display_order !== undefined ? display_order : existing.display_order
        }
      });

      await tx.auditLog.create({
        data: {
          actor_id: facultyId,
          action: 'UPDATE_CONTENT',
          details_json: {
            content_id: upd.id,
            module_id: parseInt(moduleId),
            updated_fields: { title, file_id, youtube_url, display_order }
          }
        }
      });

      return upd;
    });

    return res.json({ success: true, message: 'Content updated successfully', data: updated });
  } catch (error) {
    console.error('Update content error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update content', error: error.message });
  }
};

/**
 * Delete content
 * @route DELETE /api/faculty/modules/:moduleId/content/:contentId
 */
exports.deleteContent = async (req, res) => {
  try {
    const { moduleId, contentId } = req.params;
    const facultyId = req.user.id;

    // Verify module and access
    const module = await prisma.module.findFirst({
      where: { id: parseInt(moduleId), faculty_id: facultyId },
      include: { course: { select: { is_deleted: true } } }
    });
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found or access denied' });
    }
    if (module.course.is_deleted) {
      return res.status(400).json({ success: false, message: 'Cannot delete content from a deleted course' });
    }

    // Verify content exists
    const existing = await prisma.content.findFirst({
      where: { id: parseInt(contentId), module_id: parseInt(moduleId) }
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Content not found in this module' });
    }

    await prisma.$transaction(async (tx) => {
      await tx.content.delete({ where: { id: parseInt(contentId) } });
      await tx.auditLog.create({
        data: {
          actor_id: facultyId,
          action: 'DELETE_CONTENT',
          details_json: { content_id: parseInt(contentId), module_id: parseInt(moduleId) }
        }
      });
    });

    return res.json({ success: true, message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete content', error: error.message });
  }
};

/**
 * List all content for a module
 * @route GET /api/faculty/modules/:moduleId/content
 */
exports.listContent = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const facultyId = req.user.id;

    // Verify module and course status
    const module = await prisma.module.findFirst({
      where: { id: parseInt(moduleId), faculty_id: facultyId },
      include: { course: { select: { is_deleted: true } } }
    });
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found or access denied' });
    }
    if (module.course.is_deleted) {
      return res.status(400).json({ success: false, message: 'Cannot list content for a deleted course' });
    }

    const contents = await prisma.content.findMany({
      where: { module_id: parseInt(moduleId) },
      orderBy: { display_order: 'asc' }
    });

    return res.json({ success: true, data: contents });
  } catch (error) {
    console.error('List content error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch content', error: error.message });
  }
};

/**
 * Get a single content item
 * @route GET /api/faculty/modules/:moduleId/content/:contentId
 */
exports.getContent = async (req, res) => {
  try {
    const { moduleId, contentId } = req.params;
    const facultyId = req.user.id;

    // Verify module and course
    const module = await prisma.module.findFirst({
      where: { id: parseInt(moduleId), faculty_id: facultyId },
      include: { course: { select: { is_deleted: true } } }
    });
    if (!module) {
      return res.status(404).json({ success: false, message: 'Module not found or access denied' });
    }
    if (module.course.is_deleted) {
      return res.status(400).json({ success: false, message: 'Cannot fetch content from a deleted course' });
    }

    const content = await prisma.content.findFirst({
      where: { id: parseInt(contentId), module_id: parseInt(moduleId) }
    });
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found in this module' });
    }

    return res.json({ success: true, data: content });
  } catch (error) {
    console.error('Get content error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch content', error: error.message });
  }
};
