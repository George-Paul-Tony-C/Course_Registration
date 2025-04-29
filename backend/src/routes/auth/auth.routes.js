const r = require('express').Router();
const ctr = require('../../controllers/auth/auth.controller');
const { verifyToken } = require('../../middlewares/auth');

r.post('/register', ctr.register);
r.post('/login',    ctr.login);
r.get ('/refresh',  ctr.refresh);   // ← returns new access token using cookie
r.post('/logout',   ctr.logout);
r.get('/me', verifyToken, ctr.me);    
r.put ('/password', verifyToken, ctr.changePassword);

module.exports = r;
