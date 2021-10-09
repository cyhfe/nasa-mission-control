const express = require('express');
const planetsRouter = require('./routes/planets/planets.router');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', planetsRouter);

module.exports = app;
