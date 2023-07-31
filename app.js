const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1 - Middlewares
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2 - Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 3 - Define middleware for route error from client
app.all('*', (req, res, next) => {
  // const error = new Error(
  //   `cannot access route ${req.originalUrl} in this server`
  // );
  // error.status = 'fail';
  // error.statusCode = 404;;
  next(
    new AppError(`cannot access route ${req.originalUrl} in this server`, 404)
  ); // PASSING THE ERROR TO THE NEXT MIDDLEWARE
});

// GLOBAL ERROR HANDLING USING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
