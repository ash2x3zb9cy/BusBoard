const moment = require('moment');

const readlineSync = require('readline-sync');

const tflApi = require('./tfl_api');
const postcodeApi = require('./postcode_api');

function promptForStopID() {
	const stopID = readlineSync.question('Enter a stop ID');
	tflApi.getNextBuses(stopID, 5, (buses) => {
		buses.forEach(bus => {
			const arrival = moment(bus.expectedArrival);
			console.log(`${bus.lineName} arriving ${arrival.fromNow()}`);
		})
	});
}

function promptForPostcode() {
	const postcode = readlineSync.question('Enter (a VALID!) postcode: ');

	postcodeApi.getLatLon(postcode, (lat, lon) => {
		tflApi.getStopIDs(lat, lon, null);
	});
}

function debugGetLatLon() {
	const postcode = 'NW5 1TL';
	postcodeApi.getLatLon(postcode, (lat, lon) => {
		tflApi.getNearbyStops(lat, lon, stopPoints => {

			if(stopPoints.length === 0) {
				console.error('no nearby stops');
				return;
			}

			tflApi.getNextBuses(stopPoints[0].stopID, 5, arrivals => {
				if(arrivals.length === 0) {
					console.log('no arrivals incoming');
					return;
				}

				arrivals.forEach(arrival => {
					const time = moment(arrival.expectedArrival);
					console.log(`${arrival.lineName} arriving ${time.fromNow()}`);
				});

			});

		});
	})
}
debugGetLatLon();