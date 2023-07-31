const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  console.log(message);
  return new AppError(message, 404);
};

const errorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const errorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const handleValidationErrorDB = (err) => {
  return new AppError(err.message, 404);
};

const handleDuplicateValueErrorDB = (err) => {
  const message = `Duplicate value in a field: ${
    err.message.match(/(["'])(\\?.)*?\1/)[0]
  }`;
  return new AppError(message, 404);
};

module.exports = (err, req, res, next) => {
  // GETTING THE ERROR
  //   console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV == 'development') {
    errorDev(err, res);
  } else if (process.env.NODE_ENV == 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.code === 11000) error = handleDuplicateValueErrorDB(err);

    errorProd(error, res);
  }
  next();
};
