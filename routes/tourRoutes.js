const express = require('express');
const tourRouter = express.Router();
const controller = require('./../controllers/tourControllers');
const authController = require('./../controllers/authController');

tourRouter
  .route('/top-1-best-and-cheap')
  .get(controller.aliasTopOneTour, controller.getAllTours);

tourRouter.route('/monthly-plan/:year').get(controller.getMonthlyPlan);

tourRouter
  .route('/')
  .get(authController.protect, controller.getAllTours)
  .post(controller.createTour);

tourRouter
  .route('/:id')
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    controller.deleteTour
  );

module.exports = tourRouter;
