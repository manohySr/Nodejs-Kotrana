const express = require('express');
const controller = require('../controllers/tourControllers');
const tourRouter = express.Router();

tourRouter.param('id', controller.checkID);

tourRouter
  .route('/')
  .get(controller.getAllTours)
  .post(controller.checkBody, controller.createTour);
tourRouter
  .route('/:id')
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = tourRouter;
