const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const port = process.env.PORT || 2002;

// $env:NODE_ENV = "development"; node .\server.js => in the powershell for windows

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
});
