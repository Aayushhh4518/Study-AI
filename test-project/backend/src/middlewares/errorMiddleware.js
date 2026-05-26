const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);

  res.status(404);

  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;

  // Mongoose Bad ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    success: false,
    message,

  ...(process.env.NODE_ENV !== "production" && {
  stack: err.stack,
}),
  });
};

export { errorHandler, notFound };
