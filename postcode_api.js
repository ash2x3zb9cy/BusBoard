const request = require('request');

const API = 'http://api.postcodes.io';

function getLatLon(postcode) {
	return new Promise((resolve, reject) => {
		request(`${API}/postcodes/${postcode}`, (error, response, body) => {
			if(error) {
				return reject(error);
			}

			if(response.statusCode !== 200) {
				return reject(new Error('invalid postcode'));
			}

			const data = JSON.parse(body);
			resolve({
				lat: data.result.latitude,
				lon: data.result.longitude
			});
		});
	})
}

module.exports = {getLatLon};
