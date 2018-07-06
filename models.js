class StopPoint {
	constructor(id, commonName) {
		this.stopID = id;
		this.name = commonName;
	}
	toString() {
		return this.name;
	}
}

module.exports = {StopPoint};