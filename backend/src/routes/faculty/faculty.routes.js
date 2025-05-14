const r = require('express').Router();
const { verifyToken, requireRole } = require('../../middlewares/auth');
const multer = require('multer');
const upload = require('../../config/upload');

// Controllers
const CT = require('../../controllers/faculty/content.controller');
const C  = require('../../controllers/faculty/course.controller');
const D  = require('../../controllers/faculty/dashboard.controller');
const F  = require('../../controllers/faculty/file.controller');
const M  = require('../../controllers/faculty/module.controller');
const Q  = require('../../controllers/faculty/quiz.controller');
const S  = require('../../controllers/faculty/student.controller');
// const P  = require('../../controllers/faculty/performance.controller');
// const X  = require('../../controllers/faculty/metrics.controller');
// const N  = require('../../controllers/faculty/notification.controller');

// Middleware to check faculty role
r.use(verifyToken, requireRole('FACULTY'));

// Dashboard
r.get('/dashboard', D.dashboard);

// Course Management
r.post  ('/courses',           C.createCourse);
r.get   ('/courses',           C.listCourses);
r.get   ('/courses/:id',       C.getCourseById);
r.patch ('/courses/:id',       C.updateCourse);
r.delete('/courses/:id',       C.deleteCourse);

// Module Management
r.post  ('/courses/modules',     M.createModule);
r.get   ('/courses/:courseId/modules', M.listModules);
r.patch ('/modules/:moduleId',   M.updateModule);
r.delete('/modules/:moduleId',   M.deleteModule);

// Content Management
r.post   ('/modules/content',                                 CT.addContent);
r.get    ('/modules/:moduleId/content',                       CT.listContent);
r.get    ('/modules/:moduleId/content/:contentId',            CT.getContent);
r.patch  ('/modules/:moduleId/content/:contentId',            CT.updateContent);
r.delete ('/modules/:moduleId/content/:contentId',            CT.deleteContent);

// Quiz Management
r.post   ('/modules/:moduleId/quizzes',          Q.createQuiz);
r.get    ('/modules/:id/quizzes',          Q.listQuizzes);
r.get    ('/modules/:id/quizzes/:quizId',  Q.getQuizDetails);
r.patch  ('/modules/:id/quizzes/:quizId',  Q.updateQuiz);
r.delete ('/modules/:id/quizzes/:quizId',  Q.deleteQuiz);
r.delete ('/courses/:id/quizQuestion/:quizQuestionId',  Q.deleteQuizQuestion);

// File Upload & Management
r.post   ('/courses/files', upload.array('file'),F.uploadFile);
r.get    ('/courses/:id/files',         F.listFiles);
r.delete ('/courses/:id/files/:fileId', F.deleteFile);

// Student Management
r.get    ('/:facultyId/courses/:courseId/students' , S.listStudentsByCourse);
r.get    ('/:facultyId/students' , S.listUniqueStudentsByFaculty);

module.exports = r;
