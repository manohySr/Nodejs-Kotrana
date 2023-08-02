const User = require('./../models/userModels');
const APIFeatures = require('./../utils/APIFeatures');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('./../utils/appError');

const getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
