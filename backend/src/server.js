const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
const cookieParser = require('cookie-parser');
const api     = require('./routes');
const { PORT } = require('./config/env');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true })); // adjust
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api', api);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`⚡  Server @ http://localhost:${PORT}`));
