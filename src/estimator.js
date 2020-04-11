
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
  impact.hospitalBedsByRequestedTime = Math.ceil(
    totalHospitalBeds * 0.35
  ) - impact.severeCasesByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime = Math.ceil(
    totalHospitalBeds * 0.35
  ) - severeImpact.severeCasesByRequestedTime;

  // cases in icu
  impact.casesForICUByRequestedTime = Math.trunc(
    0.15 * impact.infectionsByRequestedTime
  );
  severeImpact.casesForICUByRequestedTime = Math.trunc(
    0.15 * severeImpact.infectionsByRequestedTime
  );

  // cases in need of ventilator
  impact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * severeImpact.infectionsByRequestedTime
  );

  // dollars in flight
  impact.dollarsInFlight = getDollarsInFlight(
    region,
    impact.infectionsByRequestedTime,
    timeToElapse,
    periodType
  );
  severeImpact.dollarsInFlight = getDollarsInFlight(
    region,
    severeImpact.infectionsByRequestedTime,
    timeToElapse,
    periodType
  );
  return {
    data,
    impact,
    severeImpact
  };
};


module.exports = covid19ImpactEstimator;
