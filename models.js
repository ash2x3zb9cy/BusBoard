const moment = require('moment');

class StopPoint {
	constructor(id, commonName) {
		this.stopID = id;
		this.name = commonName;
	}
	toString() {
		return this.name;
	}
}

class ArrivalInfo {
	constructor(opts) {
		this.lineName = opts.lineName;
		this.destinationName = opts.destinationName;
		this.expectedArrivalPretty = moment(opts.expectedArrival).fromNow();
	}
}

class BikePoint {
	constructor(opts) {
		this.id = opts.id;
		this.name = opts.commonName;
		this.lat = opts.lat;
		this.lon = opts.lon;
		//this.getDockStatus();
	}

	getDockStatus() {
		return new Promise((resolve, reject) =>{
			require('./tfl_api').bikePointInfo(this.id).then(info => {
				this.freeBikes = info.additionalProperties.find(x => x.key === "NbBikes").value;
				this.freeDocks = info.additionalProperties.find(x => x.key === "NbEmptyDocks").value;
				resolve(this);
			});
		});
	}
}

module.exports = {StopPoint, ArrivalInfo, BikePoint};