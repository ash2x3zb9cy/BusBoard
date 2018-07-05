const moment = require('moment');
const request = require('request');

const API = 'https://api.tfl.gov.uk';

function getNextBuses(stop, number, callback) {
	request(`${API}/StopPoint/${stop}/Arrivals`, (error, response, body) => {
		if(error) {
			throw error;
		}
		const data = JSON.parse(body);

		data.sort((a, b) => {
			const aArrival = moment(a.expectedArrival);
			const bArrival = moment(b.expectedArrival);
			return aArrival.isBefore(bArrival) ? -1 : 1;
		});

		callback(data.slice(0, number));
	});
}

module.exports = {getNextBuses};
