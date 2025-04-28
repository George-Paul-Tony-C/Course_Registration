// src/utils/audit.js
const prisma = require('../config/prismaClient');

module.exports = async (actorId, action, details = {}) => {
  try {
    await prisma.auditLog.create({
      data: { actorId, action, detailsJson: details }
    });
  } catch (err) {
    console.error('[AUDIT ERROR]', err.message);
    // swallow the error so your main API call still succeeds
  }
};
