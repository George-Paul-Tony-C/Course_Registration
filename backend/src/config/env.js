require('dotenv').config();

const { PORT = 4000, JWT_SECRET, DATABASE_URL } = process.env;

if (!JWT_SECRET || !DATABASE_URL) {
  throw new Error('Missing JWT_SECRET or DATABASE_URL in .env');
}

module.exports = { PORT, JWT_SECRET };
