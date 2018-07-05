const moment = require('moment');

const readlineSync = require('readline-sync');

const tflApi = require('./tfl_api');
const postcodeApi = require('./postcode_api');

const postcode = readlineSync.question('Enter (a VALID!) postcode: ');

postcodeApi.getLatLon(postcode, (lat, lon) => {
	tflApi.getStopIDs(lat, lon, null);
});


// const stopID = "490008660N";
// tflApi.getNextBuses(stopID, 5, (buses) => {
// 	buses.forEach(bus => {
// 		const arrival = moment(bus.expectedArrival);
// 		console.log(`${bus.lineName} arriving ${arrival.fromNow()}`);
// 	})
// });
