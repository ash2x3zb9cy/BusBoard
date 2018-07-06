const request = require('request');

const API = 'http://api.postcodes.io';

function getLatLon(postcode, callback) {
	request(`${API}/postcodes/${postcode}`, (error, response, body) => {
		if(error) {
			throw error;
		}
		if (response.statusCode == 404) {
			console.error("invalid postcode");
			return;
		}
		const data = JSON.parse(body);

		callback(data.result.latitude, data.result.longitude);
	});
}

function getLatLon(postcode) {
	return new Promise((resolve, reject) => {
		request(`${API}/postcodes/${postcode}`, (error, response, body) => {
			if(error) {
				reject(error);
			}

			if(response.statusCode !== 200) {
				throw new Error('invalid postcode');
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
