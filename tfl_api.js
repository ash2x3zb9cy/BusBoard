const moment = require('moment');
const request = require('request');

const API = 'https://api.tfl.gov.uk';

// get stop IDs within 500m
function getStopIDs(lat, lon, callback) {
	request({
		url: `${API}/StopPoint`,
		qs: {
			lat: lat,
			lon: lon,
			radius: 500,
			//stopTypes: 'bus',
		},
	}, (error, response, body) => {
		if(error) {
			throw error;
		}
		// TODO
		console.log(body);
	});
}

function getNextBuses(stop, number, callback) {
	request(`${API}/StopPoint/${stop}/Arrivals`, (error, response, body) => {
		if(error) {
			throw error;
		}
		if (response.statusCode == 404) {
			console.error("invalid bus stop ID");
			return;
		}
		const data = JSON.parse(body);

		// sort by arrival date
		data.sort((a, b) => {
			const aArrival = moment(a.expectedArrival);
			const bArrival = moment(b.expectedArrival);
			return aArrival.isBefore(bArrival) ? -1 : 1;
		});

		callback(data.slice(0, number));
	});
}

module.exports = {getNextBuses, getStopIDs};
