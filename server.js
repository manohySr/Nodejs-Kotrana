const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB connection successful!'));

// $env:NODE_ENV = "development"; node .\server.js => in the powershell for windows

const port = process.env.PORT || 2002;
const server = app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
