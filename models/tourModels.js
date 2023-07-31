const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour should have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour should be below or equal to 40 characters'],
      minlength: [10, 'A tour should be above or equal to 10 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour should have a duration'],
      // JUST WANT TO ADD A FUNCTION DATA-VALIDATOR FOR FUN
      validate: {
        validator: function (value) {
          // ONLY FOR THE CREATE AND SAVE BUT NOT IN UPDATE ...
          return value < 10;
        },
        message: 'A tour should have a duration below of 10',
      },
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour should have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour should have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          'A tour should have a difficulty of: easy, medium or difficult',
      },
    },
    rattinsAverage: {
      type: Number,
      max: [5.0, 'A tour should have a number rating below or equal to 5.0'],
      min: [1.0, 'A tour should have a number rating above or equal to 1.0'],
    },
    ratingsQuantity: Number,
    price: {
      type: Number,
      required: [true, 'A tour should have a price'],
    },
    summary: {
      type: String,
      required: [true, 'A tour should have a summary'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A tour should have a description'],
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour should have a image cover'],
    },
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: run only for .create() and .save()
// The this object point to the current document
tourSchema.pre('save', function (next) {
  this.name = slugify(this.name, { lower: true });
  // console.log(this.name);
  next();
});

// QUERY MIDDLEWARE
// The this object point to the current query
tourSchema.pre(/^find/, function (next) {
  // BEFORE A FIND EVENT THIS MIDDLEWARE RUN
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // AFTER A FIND EVENT THIS MIDDLEWARE RUN
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
  next();
});

// AGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
