const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const planetRouter = require('./resource/planets/planets.router');
const { errorHandler } = require('./utils');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.use('/planets', planetRouter);

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

app.use(errorHandler);

module.exports = app;
