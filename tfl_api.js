const moment = require('moment');
const request = require('request');

const models = require('./models');

const API = 'https://api.tfl.gov.uk';

// get stops near a point
function getNearbyStops(lat, lon, callback) {
	request({
		url: `${API}/StopPoint`,
		qs: {
			lat: lat,
			lon: lon,
			radius: 220,
			stopTypes: ['NaptanPublicBusCoachTram'].join(','),
		},
	}, (error, response, body) => {
		if(error) {
			throw error;
		}

		if (response.statusCode !== 200) {
			console.error('invalid lat/lon');
			return;
		}

		const data = JSON.parse(body);

		if(data.stopPoints.length === 0) {
			// TODO: Repeat query with greater distance?
			console.error('no nearby stops found');
			return;
		}

		const stopPoints = data.stopPoints.map(x => new models.StopPoint(x.id, x.commonName));

		callback(stopPoints);

	});
}

function getNextBuses(stop, number, callback) {
	request(`${API}/StopPoint/${stop}/Arrivals`, (error, response, body) => {
		if(error) {
			throw error;
		}
		if (response.statusCode !== 200) {
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

module.exports = {getNextBuses, getNearbyStops};
