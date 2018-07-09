const express = require('express');

const tflApi = require('./tfl_api');
const postcodeApi = require('./postcode_api');


const app = express();

app.use(express.static('frontend'));

app.get('/', (req, res) => {
	res.send('<!DOCTYPE html><html><body><h1>Hi</h1></body></html>');
});

app.get('/departureBoard', (req, res) => {

	postcodeApi.getLatLon(req.query.postcode)
		.then(latlon => {
			return tflApi.getNearbyStops(latlon.lat, latlon.lon);
		})
		.then(stopPoints => {
			return Promise.all(stopPoints.slice(0, 2).map(x => {
				return tflApi.getNextBuses(x, 5);
			}));
		})
		.then(arrivals => {
			res.json(arrivals);
		})
		.catch((e) => {
			console.log(e);
			res.json([]);
		});

});

app.get('/searchBikes', (req, res) => {
	console.log('Got request', req.query);
	tflApi.searchBikes(req.query.searchTerm)
		.then(bikePoints => {
			res.json(bikePoints);
		})
		.catch((e) => {
			console.error(e);
			res.json([]);
		});
});

app.get('/bikesInBounds', (req, res) => {
	tflApi.getBikesInArea(req.query.lat1, req.query.lon1, req.query.lat2, req.query.lon2)
		.then(bikePoints => {
			res.json(bikePoints);
		})
		.catch((e) => {
			console.error(e);
			res.json([]);
		});
});

app.listen(3000, () => console.log('listening'));


module.exports = {app};
