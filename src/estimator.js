const getInfectionsByRequestedTime = ({infected , periodType ,  timeToElapse }) => {
    return infected  * (2 ** convertTodays(periodType ,timeToElapse )
};
const convertTodays = (periodType, time) => {
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
const covid19ImpactEstimator = ({
  reportedCases,
  periodType,
  timeToElapse
}) => {
  let impact = {};
  let severeImpact = {};

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
      infected  :severeImpact.currentlyInfected,
      periodType,
      timeToElapse
  })
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
