function notFound(_, res) {
  res.status(404).json({ message: 'Route not found' });
}

function errorHandler(err, _req, res, _next) {
  console.error(err);
  res.status(500).json({ message: 'Server error', detail: err.message });
}

module.exports = { notFound, errorHandler };
