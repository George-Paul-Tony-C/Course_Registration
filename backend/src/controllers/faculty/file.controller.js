// controllers/faculty/file.controller.js
const prisma = require('../../config/prismaClient');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Assume upload config is defined elsewhere
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

/**
 * Upload files related to the course
 * @route POST /api/faculty/courses/files
 */
exports.uploadFile = async (req, res) => {
  try {
    const facultyId = req.user.id;

    // Check if file exists in request
    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const files = req.files || [req.file];
    const uploadedFiles = [];

    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Process each file
    for (const file of files) {
      const fileName = `${uuidv4()}-${file.originalname.replace(/\s+/g, '-')}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);
      
      // Save file record to database
      const fileRecord = await prisma.file.create({
        data: {
          uploader_id: facultyId,
          original_name: file.originalname,
          stored_path: filePath,
          mime_type: file.mimetype,
          size_bytes: file.size
        }
      });
      
      uploadedFiles.push({
        id: fileRecord.id,
        originalName: fileRecord.original_name,
        mimeType: fileRecord.mime_type,
        sizeBytes: fileRecord.size_bytes
      });
    }

    // Log this action
    await prisma.auditLog.create({
      data: {
        actor_id: facultyId,
        action: 'UPLOAD_FILES',
        details_json: {
          file_count: uploadedFiles.length,
          file_ids: uploadedFiles.map(f => f.id)
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Upload file error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload file(s)',
      error: error.message
    });
  }
};

/**
 * List all files related to the course
 * @route GET /api/faculty/courses/:id/files
 */
exports.listFiles = async (req, res) => {
  try {
    const { id } = req.params; // Course ID
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
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have access'
      });
    }

    // Find all modules for this course
    const modules = await prisma.module.findMany({
      where: {
        course_id: parseInt(id)
      },
      select: {
        id: true
      }
    });

    const moduleIds = modules.map(m => m.id);

    // Find all content and associated files for these modules
    const contents = await prisma.content.findMany({
      where: {
        module_id: {
          in: moduleIds
        },
        file_id: {
          not: null
        }
      },
      include: {
        file: true,
        module: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    // Format the response
    const files = contents.map(content => ({
      id: content.file.id,
      originalName: content.file.original_name,
      mimeType: content.file.mime_type,
      sizeBytes: content.file.size_bytes,
      uploadedAt: content.file.uploaded_at,
      contentId: content.id,
      contentTitle: content.title,
      moduleId: content.module.id,
      moduleTitle: content.module.title
    }));

    return res.status(200).json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('List files error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve files',
      error: error.message
    });
  }
};

/**
 * Delete a file
 * @route DELETE /api/faculty/courses/:id/files/:fileId
 */
exports.deleteFile = async (req, res) => {
  try {
    const { id, fileId } = req.params;
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
      }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have access'
      });
    }

    // Check if the file exists and is associated with this course
    const file = await prisma.file.findUnique({
      where: {
        id: parseInt(fileId)
      }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check if file is used in any content
    const contentUsingFile = await prisma.content.findFirst({
      where: {
        file_id: parseInt(fileId),
        module: {
          course_id: parseInt(id)
        }
      }
    });

    if (contentUsingFile) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete file as it is being used in course content',
        contentId: contentUsingFile.id
      });
    }

    await prisma.$transaction(async (prismaClient) => {
      // Delete the file record
      await prismaClient.file.delete({
        where: { id: parseInt(fileId) }
      });

      // Log this action
      await prismaClient.auditLog.create({
        data: {
          actor_id: facultyId,
          action: 'DELETE_FILE',
          details_json: {
            file_id: parseInt(fileId),
            course_id: parseInt(id),
            file_name: file.original_name
          }
        }
      });
    });

    // Delete the physical file
    try {
      if (fs.existsSync(file.stored_path)) {
        fs.unlinkSync(file.stored_path);
      }
    } catch (fsError) {
      console.error('Error deleting physical file:', fsError);
      // Continue even if physical file deletion fails
    }

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete file',
      error: error.message
    });
  }
};