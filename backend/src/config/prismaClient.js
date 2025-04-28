const { PrismaClient } = require('@prisma/client');

let prisma;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // prevent hot-reload duplications in dev
  global.__prisma = global.__prisma || new PrismaClient();
  prisma = global.__prisma;
}

module.exports = prisma;
