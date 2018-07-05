const request = require('request');

const API = 'http://api.postcodes.io';

function getLatLon(postcode, callback) {
	request(`${API}/postcodes/${postcode}`, (error, response, body) => {
		if(error) {
			throw error;
		}
		if (response.statusCode == 404) {
			console.log("invlaid postcode");
			return;
		}
		const data = JSON.parse(body);

		callback(data.result.latitude, data.result.longitude);
	});
}

module.exports = {getLatLon};

// NW5 1TL