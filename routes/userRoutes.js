const express = require('express');
const controller = require('../controllers/userControllers');

const userRouter = express.Router();

userRouter.route('/').get(controller.getAllUsers).post(controller.createUser);
userRouter
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = userRouter;
