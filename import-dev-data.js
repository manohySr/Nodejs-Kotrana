const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./models/tourModels');

dotenv.config({ path: './config.env' });

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connection successful!'));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data.json`));

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('All collection deleted in DB');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log(`All collection imported from ${__filename} to the DB`);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
