// src/routes/admin/admin.routes.js
const r = require('express').Router();
const { verifyToken, requireRole } = require('../../middlewares/auth');
const U = require('../../controllers/admin/user.controller');
const C = require('../../controllers/admin/course.controller');
const F = require('../../controllers/admin/faculty.controller');
const S = require('../../controllers/admin/student.controller');
const Q = require('../../controllers/admin/quiz.controller');
const M = require('../../controllers/admin/metrics.controller');
const SET = require('../../controllers/admin/settings.controller');

r.use(verifyToken, requireRole('ADMIN'));

// users
r.get   ('/users',     U.list);
r.post  ('/users',     U.create);
r.patch ('/users/:id', U.update);
r.delete('/users/:id', U.remove);

// courses
r.get   ('/courses',      C.list);
r.post  ('/courses',      C.create);
r.patch ('/courses/:id',  C.update);
r.delete('/courses/:id',  C.remove);

// faculty ↔ course
r.get   ('/courses/:id/faculty',       F.list);
r.post  ('/courses/:id/faculty',       F.assign);
r.delete('/courses/:id/faculty/:fid',  F.remove);

// students ↔ course
r.get   ('/courses/:id/students',        S.list);
r.post  ('/courses/:id/students',        S.enroll);
r.delete('/courses/:id/students/:sid',   S.remove);

// quizzes
r.get('/quizzes', Q.list);

// metrics & settings
r.get ('/metrics',   M.dashboard);
r.get ('/settings',  SET.list);
r.patch('/settings', SET.update);

module.exports = r;
