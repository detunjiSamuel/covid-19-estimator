require('dotenv').config();
const express = require('express');
const xml = require('xml2js');

const xmlBuilder = new xml.Builder();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const writer = require('fs').createWriteStream('logs.txt', { flags: 'a' });
const covid19ImpactEstimator = require('./estimator');

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

const estimator = (req, res) => {
  let data;
  if (req.body) {
    data = covid19ImpactEstimator(req.body);
    if (req.params.format === 'xml') {
      res.set('Content-Type', 'text/xml');
      return res.status(200).send(xmlBuilder.buildObject(data));
    }

    return res.status(200).json(data);
  }
  if (req.params.format === 'xml') {
    res.set('Content-Type', 'text/xml');
    return res.status(500).send(xmlBuilder.buildObject('invalid'));
  }

  return res.status(500).json(' input is not valid');
};

app.post('/api/v1/on-covid-19/:format', estimator);
app.post('/api/v1/on-covid-19/*', estimator);
app.post('/api/v1/on-covid-19', estimator);



app.listen(PORT);
