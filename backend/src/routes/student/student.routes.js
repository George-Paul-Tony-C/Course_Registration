// src/routes/student.routes.js
const r = require('express').Router();
const { verifyJWT } = require('../../middlewares/auth');
const authorize     = require('../../middlewares/authorize');

r.use(verifyJWT, authorize(['STUDENT']));
r.get('/dashboard', (_req, res) => res.json({ message: 'Hello Student' }));
module.exports = r;
