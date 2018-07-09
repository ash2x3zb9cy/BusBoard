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
			qs: {
				query: searchterm,
				app_id:"ec0267f0",
				app_key:"f9adfeac47994d0615fb1521b1ef397d",
			},
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

			Promise.all(data.slice(0,50).map(x => (new models.BikePoint(x)).getDockStatus()))
				.then(values => resolve(values));

		});
	});
}

function bikePointInfo(bikePointId) {
	return new Promise((resolve, reject) => {
		console.log(`bikePointInfo(${bikePointId})`);
		request({
			url:`${API}/BikePoint/${bikePointId}`,
			app_id:"ec0267f0",
			app_key:"f9adfeac47994d0615fb1521b1ef397d",
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

function getBikesInArea(lat1, lon1, lat2, lon2) {
	let swLat = Math.min(lat1, lat2);
	let swLon = Math.min(lon1, lon2);
	let neLat = Math.max(lat1, lat2);
	let neLon = Math.max(lon1, lon2);

	return new Promise((resolve, reject) => {
		console.log(`getBikesInArea`);
		request({
			url:`${API}/Place`,
			qs: {
				type:"BikePoint",
				swLat:swLat,
				swLon:swLon,
				neLat:neLat,
				neLon:neLon,
				app_id:"ec0267f0",
				app_key:"f9adfeac47994d0615fb1521b1ef397d",
			}}, (error, response, body) => {
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
			console.log(data);

			Promise.all(data.slice(0,50).map(x => (new models.BikePoint(x)).getDockStatus()))
				.then(values => resolve(values));

		});
	});
}

module.exports = {getNextBuses, getNearbyStops, searchBikes, bikePointInfo, getBikesInArea};
