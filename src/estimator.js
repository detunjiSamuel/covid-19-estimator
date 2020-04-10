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
// eslint-disable-next-line max-len
const getInfectionsByRequestedTime = ({ infected, periodType, timeToElapse }) =>
  infected * 2 ** convertToDays(periodType, timeToElapse);

const covid19ImpactEstimator = ({
  reportedCases,
  periodType,
  timeToElapse,
  totalHospitalBeds
}) => {
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
  impact.hospitalBedsByRequestedTime =
    totalHospitalBeds * 0.35 - impact.severeCasesByRequestedTime;
  severeImpact.hospitalBedsByRequestedTime =
    totalHospitalBeds * 0.35 - severeImpact.severeCasesByRequestedTime;


};

export default covid19ImpactEstimator;

/* challenge 1 
    impact.currentlyInfected = input.reportedCases * 10


    currentlyInfected doubles every 3 days ,meaning to get in 30days 
    it would be 2 ^ something
    infectionsByRequestedTime =  currentlyInfected * (2 ^ n)


    severeImpact.currentlyInfected = input.reportedCases * 50

*/

/* challenge 2

    severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime
    hospitalBedsByRequestedTime =  (input.totalHospitalBeds * 35%) - severeCasesByRequestedTime

*/
/* challenge 3
    casesForICUByRequestedTime =  0.05 * infectionsByRequestedTime
    casesForVentilatorsByRequestedTime =  0.02 * infectionsByRequestedTime
    dollarsInFlight =  (infectionsByRequestedTime * input.region.avgDailyIncomePopulation ) * input.region.avgDailyIncomeInUSD  * number_of_days(self-computed)



*/
/** challenge 4
 * build a rest api
 *
 * /api/v1/on-covid-19 POST || can add /format
 * accepts the input object
 *
 * have BACKEND = "http://somthing.com" in.env
 *
 *
 * have a request -response time difference
 *  /api/v1/on-covid-19/logs Get
 * return type  text
 * return timestamp \t path \t done in "time diffetence" timeUnit(seconds)
 *
 */
