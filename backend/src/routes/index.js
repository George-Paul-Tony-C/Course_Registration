// src/routes/index.js (mount everything)
const { Router }  = require('express');
const authRoutes  = require('./auth/auth.routes');
const adminRoutes = require('./admin/admin.routes');
const facRoutes   = require('./faculty/faculty.routes');
const stuRoutes   = require('./student/student.routes')

const api = Router();
api.use('/auth',    authRoutes);
api.use('/admin',   adminRoutes);
api.use('/faculty', facRoutes);
api.use('/student', stuRoutes);



module.exports = api;
