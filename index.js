const moment = require('moment');

const readlineSync = require('readline-sync');

const tflApi = require('./tfl_api');

const stopID = readlineSync.question('Enter bus stop ID: ');

tflApi.getNextBuses(stopID, 5, (buses) => {
	buses.forEach(bus => {
		const arrival = moment(bus.expectedArrival);
		console.log(`${bus.lineName} arriving ${arrival.fromNow()}`);
	})
});
