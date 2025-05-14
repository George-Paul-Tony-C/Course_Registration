const prisma = require('../../config/prismaClient');

// GET /faculties/:facultyId/courses/:courseId/students
exports.listStudentsByCourse = async (req, res) => {
  const courseId  = parseInt(req.params.courseId,  10);
  const facultyId = parseInt(req.params.facultyId, 10);

  try {
    const enrollments = await prisma.courseStudent.findMany({
      where: {
        course_id:  courseId,
        faculty_id: facultyId,
      },
      include: {
        student: {
          select: {
            id:       true,
            username: true,
            email:    true,
          },
        },
      },
    });

    const students = enrollments.map(e => e.student);

    return res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
      data: students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error:   error.message,
    });
  }
};

// GET /faculties/:facultyId/students
exports.listUniqueStudentsByFaculty = async (req, res) => {
  const facultyId = parseInt(req.params.facultyId, 10);

  try {
    const enrollments = await prisma.courseStudent.findMany({
      where: { faculty_id: facultyId },
      distinct: ['student_id'],              // ← only one record per student
      include: {
        student: {
          select: {
            id:       true,
            username: true,
            email:    true,
          },
        },
      },
    });

    const students = enrollments.map(e => e.student);

    return res.status(200).json({
      success: true,
      message: 'Unique students fetched successfully',
      data:    students,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error:   error.message,
    });
  }
};



// Enroll a student in a course
exports.enrollStudent = async (req, res) => {
  const { id } = req.params; // Course ID
  const { student_id } = req.body;

  try {
    // Check if the student is already enrolled
    const existingEnrollment = await prisma.courseStudent.findFirst({
      where: { course_id: parseInt(id, 10), student_id: parseInt(student_id, 10) },
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this course',
      });
    }

    const enrolledStudent = await prisma.courseStudent.create({
      data: {
        course_id: parseInt(id, 10),
        student_id: parseInt(student_id, 10),
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Student enrolled successfully',
      data: enrolledStudent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to enroll student',
      error: error.message,
    });
  }
};

// Update student information
exports.updateStudent = async (req, res) => {
  const { id, studentId } = req.params; // Course ID, Student ID
  const { username, email } = req.body;

  try {
    const updatedStudent = await prisma.user.update({
      where: { id: parseInt(studentId, 10) },
      data: { username, email },
    });

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message,
    });
  }
};

// Remove a student from a course
exports.removeStudent = async (req, res) => {
  const { id, studentId } = req.params; // Course ID, Student ID

  try {
    const student = await prisma.courseStudent.findFirst({
      where: { course_id: parseInt(id, 10), student_id: parseInt(studentId, 10) },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not enrolled in this course',
      });
    }

    await prisma.courseStudent.delete({
      where: { id: student.id },
    });

    return res.status(200).json({
      success: true,
      message: 'Student removed from course successfully',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove student',
      error: error.message,
    });
  }
};
