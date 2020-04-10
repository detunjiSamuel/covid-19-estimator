
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const writer = require('fs').createWriteStream('logs.txt', { flags: 'a' });
const estimator = require('./estimator');

const { PORT } = process.env;

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Access, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  morgan(':method   :url    :status   :response-time ms', {
    stream: writer
  })
);

app.post('/api/v1/on-covid-19/:format', estimator);
app.post('/api/v1/on-covid-19/*', estimator);

app.listen(PORT);
