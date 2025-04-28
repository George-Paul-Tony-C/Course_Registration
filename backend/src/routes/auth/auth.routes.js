const r = require('express').Router();
const ctr = require('../../controllers/auth/auth.controller');

r.post('/register', ctr.register);
r.post('/login',    ctr.login);
r.get ('/refresh',  ctr.refresh);   // ← returns new access token using cookie
r.post('/logout',   ctr.logout);

module.exports = r;
