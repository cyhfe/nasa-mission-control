const CONFIG_PATH =
  process.env.NODE_ENV === 'production' ? '.env.prod' : '.env';
require('dotenv').config({ path: CONFIG_PATH });

const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');

const server = http.createServer(app);

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

async function start() {
  await mongoose.connect(MONGO_URL).then(
    () => console.log('connected to ' + MONGO_URL),
    (err) => console.log(err)
  );
  server.listen(PORT, () => {
    console.log('server running in ' + PORT);
  });
}

start();
