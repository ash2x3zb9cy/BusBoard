const moment = require('moment');
const request = require('request');

const models = require('./models');

const API = 'https://api.tfl.gov.uk';

function getNearbyStops(lat, lon) {
	return new Promise((resolve, reject) => {
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
				reject(error);
			}
			if (response.statusCode !== 200) {
				throw new Error('invalid lat/lon');
			}

			const data = JSON.parse(body);

			resolve(data.stopPoints.map(x => new models.StopPoint(x.id, x.commonName)));
		});
	});
}

function getNextBuses(stop, number) {
	return new Promise((resolve, reject) => {
		request(`${API}/StopPoint/${stop}/Arrivals`, (error, response, body) => {
			if(error) {
				reject(error);
			}

			if(response.statusCode !== 200) {
				throw new Error('invalid bus stop ID');
			}

			const data = JSON.parse(body);

			data.sort((a, b) => {
				const aArrival = moment(a.expectedArrival);
				const bArrival = moment(b.expectedArrival);
				return aArrival.isBefore(bArrival) ? -1 : 1;
			});

			resolve(data.slice(0, number));
		});
	});
}

module.exports = {getNextBuses, getNearbyStops};
