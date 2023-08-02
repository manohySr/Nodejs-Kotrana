const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// name email photo password passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    // using third party validator waiting for the internet access
    // validate: [validator.isEmail, 'Please provide a valid email'],
    validate: {
      validator: function (el) {
        return validator.isEmail(el);
      },
      message: 'Please provide a valid email',
    },
  },
  photo: String,
  role: {
    type: String,
    enum: {
      values: ['admin', 'lead-guide', 'guide', 'user'],
      message: 'role should be admin, guide or lead-guide',
    },
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangeAt: Date,
});

// Using document middleware to handle encryption of the password
userSchema.pre('save', async function (next) {
  // middleware run in bettwen of getting data and saving it
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// INSTANCE MODEL METHODE
// could be used by all the instance documents
userSchema.methods.isPasswordValid = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changesPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    // convert the time unit
    const changedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp, changedTimestamp);
    return JWTTimestamp < changedTimestamp; // comparing the date of token issue
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
