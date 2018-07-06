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

module.exports = {StopPoint, ArrivalInfo};