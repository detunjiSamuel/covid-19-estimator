const xml = require('xml2js');

const xmlBuilder = new xml.Builder();
const convertToDays = (periodType, time) => {
  let result;
  switch (periodType) {
    case 'days':
      result = time;
      break;
    case 'weeks':
      result = time * 7;
      break;
    case 'months':
      result = time * 30;
      break;
    default:
      result = time;
      break;
  }
  return result;
};
const getDollarsInFlight = (
  { avgDailyIncomeInUSD, avgDailyIncomePopulation },
  infectionsByRequestedTime,
  timeToElapse,
  periodType
) => {
  const timeInDays = convertToDays(periodType, timeToElapse);
  const moneyLost = infectionsByRequestedTime
    * avgDailyIncomePopulation
    * avgDailyIncomeInUSD
    * timeInDays;
  return moneyLost;
};
// eslint-disable-next-line max-len
const getInfectionsByRequestedTime = ({
  infected,
  periodType,
  timeToElapse
}) => {
  const timeInDays = convertToDays(periodType, timeToElapse);
  return infected * 2 ** Math.floor(timeInDays / 3);
};

// main stuff
const covid19ImpactEstimator = (data) => {
  const {
    reportedCases,
    periodType,
    timeToElapse,
    totalHospitalBeds,
    region
  } = data;
  const impact = {};
  const severeImpact = {};

  // currently infected
  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;
  // infections by requested time
  impact.infectionsByRequestedTime = getInfectionsByRequestedTime({
    infected: impact.currentlyInfected,
    periodType,
    timeToElapse
  });
  severeImpact.infectionsByRequestedTime = getInfectionsByRequestedTime({
    infected: severeImpact.currentlyInfected,
    periodType,
    timeToElapse
  });

  // severe cases by requestedtime
  impact.severeCasesByRequestedTime = Math.floor(
    0.15 * impact.infectionsByRequestedTime
  );
  severeImpact.severeCasesByRequestedTime = Math.floor(
    0.15 * severeImpact.infectionsByRequestedTime
  );

  // avaliable hospital beds
  impact.hospitalBedsByRequestedTime = Math.floor(
    totalHospitalBeds * 0.35 - impact.severeCasesByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = Math.floor(
    totalHospitalBeds * 0.35 - severeImpact.severeCasesByRequestedTime
  );

  // cases in icu
  impact.casesForICUByRequestedTime = Math.floor(
    0.15 * impact.infectionsByRequestedTime
  );
  severeImpact.casesForICUByRequestedTime = Math.floor(
    0.15 * severeImpact.infectionsByRequestedTime
  );

  // cases in need of ventilator
  impact.casesForVentilatorsByRequestedTime = Math.floor(
    0.02 * impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = Math.floor(
    0.02 * severeImpact.infectionsByRequestedTime
  );

  // dollars in flight
  impact.dollarsInFlight = getDollarsInFlight(
    region,
    impact.severeCasesByRequestedTime,
    timeToElapse,
    periodType
  );
  severeImpact.dollarsInFlight = getDollarsInFlight(
    region,
    severeImpact.severeCasesByRequestedTime,
    timeToElapse,
    periodType
  );
  return {
    data,
    impact,
    severeImpact
  };
};

const estimator = (req, res) => {
  let data;
  if (!req.body) {
    data = covid19ImpactEstimator(req.body);
    if (req.params.type === 'xml') {
      res.set('Content-Type', 'text/xml');
      return res.status(200).send(xmlBuilder.buildObject(data));
    }

    return res.status(200).json(data);
  }
  if (req.params.type === 'xml') {
    res.set('Content-Type', 'text/xml');
    return res.status(500).send(xmlBuilder.buildObject('invalid'));
  }

  return res.status(500).json(' input');
};

module.exports = estimator;
