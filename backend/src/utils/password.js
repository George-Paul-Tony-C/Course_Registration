// src/utils/password.js
const bcrypt = require('bcryptjs');
module.exports.hash = (pwd) => bcrypt.hash(pwd, 10);
module.exports.matches = (pwd, hash) => bcrypt.compare(pwd, hash);
