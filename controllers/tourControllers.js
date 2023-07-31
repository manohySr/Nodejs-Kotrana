const Tour = require('./../models/tourModels');
const APIFeatures = require('./../utils/APIFeatures');
const cachAsyncError = require('./../utils/cachSyncError');
const AppError = require('./../utils/appError');

const aliasTopOneTour = (req, res, next) => {
  req.query.sort = '-ratingsQuantity price';
  req.query.limit = 1;
  req.query.fields = 'name duration maxGroupSize ratingsQuantity price';
  next();
};

const getMonthlyPlan = cachAsyncError(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', //create a new document that separate the startDates because stratDate is an array
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        difficulty: { $push: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsQuantity' },
        avgPrice: { $avg: '$price' },
        name: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        // delete _id to data response
        _id: 0,
      },
    },
    {
      $sort: {
        // descendant data
        avgRating: -1,
      },
    },
    {
      $limit: 10,
    },
  ]);

  res.status(200).json({
    status: 'success',
    result: plan.length,
    data: {
      plan,
    },
  });
});

const getAllTours = cachAsyncError(async (req, res, next) => {
  // DEFINING QUERY
  let query = Tour.find();

  let features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // EXECUTING QUERY
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
});

const createTour = cachAsyncError(async (req, res) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    tour: newTour,
  });
  // try {
  //   // const newTour = new Tour({});
  //   // newTour.save();

  //   const newTour = await Tour.create(req.body);

  //   res.status(201).json({
  //     status: 'success',
  //     tour: newTour,
  //   });
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: error,
  //   });
  // }
});

const getTour = cachAsyncError(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found in that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

const updateTour = cachAsyncError(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

const deleteTour = cachAsyncError(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopOneTour,
  getMonthlyPlan,
};
