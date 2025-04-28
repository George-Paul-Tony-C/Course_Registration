// src/routes/faculty.routes.js
const r = require('express').Router();
const { verifyJWT } = require('../../middlewares/auth');
const authorize     = require('../../middlewares/authorize');

r.use(verifyJWT, authorize(['FACULTY']));
r.get('/dashboard', (_req, res) => res.json({ message: 'Hello Faculty' }));
module.exports = r;
