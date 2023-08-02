const express = require('express');
const userRouter = express.Router();

const controller = require('./../controllers/userControllers');
const authController = require('./../controllers/authController');

userRouter.post('/signup', authController.signUp);
userRouter.post('/login', authController.login);

userRouter.route('/').get(controller.getAllUsers).post(controller.createUser);
userRouter
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = userRouter;
