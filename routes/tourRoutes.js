const express = require('express');
const controller = require('../controllers/tourControllers');
const tourRouter = express.Router();

tourRouter
  .route('/top-1-best-and-cheap')
  .get(controller.aliasTopOneTour, controller.getAllTours);

tourRouter.route('/monthly-plan/:year').get(controller.getMonthlyPlan);

tourRouter.route('/').get(controller.getAllTours).post(controller.createTour);

tourRouter
  .route('/:id')
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = tourRouter;
