const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('./../models/userModels');
const catchAsyncError = require('./../utils/catchAsyncError');
const AppError = require('./../utils/appError');

// function qui crée le token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const signUp = catchAsyncError(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = createToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsyncError(async (req, res, next) => {
  // 1) get the email and password from req
  const { email, password } = req.body;

  // 2) check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  // 3) check if email and password are correct
  //        a- We will find the user by email
  const user = await User.findOne({ email }).select('+password'); // '+password' bcause password select: false
  //        b- We will use the instance methode from the userModel(schema) to compare
  if (!user || !(await user.isPasswordValid(password, user.password))) {
    return next(new AppError('Incorrect email or password !!!', 401));
  }

  // 4) define the token
  const token = createToken(user._id);
  // 5) res respond to the client
  res.status(200).json({
    status: 'success',
    token,
  });
});

const protect = catchAsyncError(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2) Decode token to get the payload
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // 3) Check if user exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('User beloging to this token does no longer exist.', 401)
    );
  }

  // 4) Check if user modified password after the token was issued
  if (freshUser.changesPasswordAfter(decoded.iat)) {
    //iat => issued at
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;

  next();
});

// Authorization for deletion
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // We will restrict the deletion to the role included in roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    }
    next();
  };
};

module.exports = {
  signUp,
  login,
  protect,
  restrictTo,
};
