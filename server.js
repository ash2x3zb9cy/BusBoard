const express = require('express');

const tflApi = require('./tfl_api');
const postcodeApi = require('./postcode_api');

function createApp() {
	const app = express();

	app.get('/', (req, res) => {
		res.send('<!DOCTYPE html><html><body><h1>Hi</h1></body></html>');
	});

	app.get('/departureBoard', (req, res) => {

		postcodeApi.getLatLon(req.query.postcode)
			.then(latlon => {
				console.log('latlon:', latlon);
				return tflApi.getNearbyStops(latlon.lat, latlon.lon);
			})
			.then(stopPoints => {
				return Promise.all(stopPoints.slice(0, 2).map(x => {
					return tflApi.getNextBuses(x, 5);
				}));
			})
			.then(arrivals => {
				console.log('arrivals:', arrivals.length, arrivals[0].length);
				res.json(arrivals);
			})
			.catch((e) => {
				console.log(e);
				res.json([]);
			});

	});


	app.listen(3000, () => console.log('listening'));

	return app;
}

module.exports = {createApp};
