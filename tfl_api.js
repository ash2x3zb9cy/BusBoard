const moment = require('moment');
const request = require('request');

const models = require('./models');

const API = 'https://api.tfl.gov.uk';

function getNearbyStops(lat, lon) {
	console.log(`getNearbyStops(${lat}, ${lon})`);
	return new Promise((resolve, reject) => {
		request({
			url: `${API}/StopPoint`,
			qs: {
				lat: lat,
				lon: lon,
				radius: 200,
				stopTypes: ['NaptanPublicBusCoachTram'].join(','),
			},
		}, (error, response, body) => {
			if(error) {
				console.log(`[getNearbyStops] ${error}`);
				return reject(error);
			}
			if (response.statusCode !== 200) {
				console.log(`[getNearbyStops] ${response.statusCode}`);
				throw new Error('invalid lat/lon');
			}
			const data = JSON.parse(body);
			const map = data.stopPoints.map(x => new models.StopPoint(x.id, x.commonName));
			resolve(map);
		});
	});
}

function getNextBuses(stop, number) {
	console.log(`getNextBuses(${stop.stopID}, ${number})`);	
	return new Promise((resolve, reject) => {
		console.log(`${API}/StopPoint/${stop.stopID}/Arrivals`);
		request(`${API}/StopPoint/${stop.stopID}/Arrivals`, (error, response, body) => {
			if(error) {
				return reject(error);
			}

			switch(response.statusCode){
				case 404:
					return resolve([]);
					break;
				case 200:
					break;
				default:
					return reject();
			}

			const data = JSON.parse(body);

			data.sort((a, b) => {
				const aArrival = moment(a.expectedArrival);
				const bArrival = moment(b.expectedArrival);
				return aArrival.isBefore(bArrival) ? -1 : 1;
			});

			resolve({
				stop: stop,
				arrivals: data.slice(0, number).map(x => new models.ArrivalInfo(x)),
			});
		});
	});
}

function searchBikes(searchterm) {
	return new Promise((resolve, reject) => {
		console.log(`searchBikes(${searchterm})`);
		request({
			url: `${API}/BikePoint/Search`,
			qs: { query: searchterm },
		}, (error, response, body) => {
			if(error) {
				return reject(error);
			}

			switch(response.statusCode){
				case 200:
					break;
				default:
					return reject(body);
			}

			const data = JSON.parse(body);

			resolve(data);

		});
	});
}

module.exports = {getNextBuses, getNearbyStops, searchBikes};
