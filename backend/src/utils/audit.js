// src/utils/audit.js
const prisma = require('../config/prismaClient');

module.exports = async (actorId, action, details = {}) => {
  try {
    await prisma.auditLog.create({
      data: { 
        actor_id : actorId || null, 
        action, 
        details_json: details }
    });
  } catch (err) {
    console.error('[AUDIT ERROR]', err.message);
    // swallow the error so your main API call still succeeds
  }
};
