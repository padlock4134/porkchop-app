'use strict';

// Catch-all error handler middleware for unexpected server errors
const errorMiddleware = function (error, req, res) {
  console.error(error);

  const { stack } = error;
  if (stack) {
    console.error(stack);
  }

  return res
    .status(500)
    .json({ code: 'UNEXPECTED_ERROR', message: 'An unexpected error occurred on our end.  Please try again later.' });
};

module.exports = errorMiddleware;
