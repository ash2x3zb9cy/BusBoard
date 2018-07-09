
function addBikeMarker (bikePoint) {
	let bike = '<img src="images/bike.svg" height="25px" width="25px">';
	let dock = '<img src="images/dock.svg" height="25px" width="25px">';

	let bikes = '';
	for (let i=1; i<=bikePoint.freeBikes; i++) {
		bikes += ' ' + bike;
	}
	let docks = '';
	for (let i=1; i<=bikePoint.freeDocks; i++) {
		docks += ' ' + dock;
	}

	return `<h2>${bikePoint.name}</h2>
			<p>Free bikes: ${bikePoint.freeBikes} ${bikes}</p>
			<p>Free docks: ${bikePoint.freeDocks} ${docks}</p>`
}


window.onload = () => {
	var map = L.map('map', {
		center: [51.499306, -0.135942],
		zoom: 12
	});

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: 'No u'
	}).addTo(map);

	const searchBar = document.getElementById('searchTerm');

	let bikeXhr = null;
	const markers = L.layerGroup();
	markers.addTo(map);

	searchBar.addEventListener('input', e => {

		if(bikeXhr !== null) bikeXhr.abort();

		console.log('Opening bikeXhr');
		bikeXhr = new XMLHttpRequest();
		bikeXhr.open('GET', `/searchBikes?searchTerm=${searchBar.value}`);
		bikeXhr.setRequestHeader('Content-Type', 'application/json');
		bikeXhr.onload = () => {
			console.log(JSON.parse(bikeXhr.responseText));

			markers.clearLayers();

			const data = JSON.parse(bikeXhr.responseText);

			const maxLat = Math.max(...data.map(bikePoint => Number(bikePoint.lat)));
			const minLat = Math.min(...data.map(bikePoint => Number(bikePoint.lat)));
			const maxLon = Math.max(...data.map(bikePoint => Number(bikePoint.lon)));
			const minLon = Math.min(...data.map(bikePoint => Number(bikePoint.lon)));
			const latlng = [[maxLat, maxLon], [minLat, minLon]];
			console.log(latlng);

			map.flyToBounds(latlng);

			data.forEach(bikePoint => {
				L.marker([bikePoint.lat, bikePoint.lon]).addTo(markers).bindPopup(addBikeMarker(bikePoint));
			});
		}
		bikeXhr.send();
	});

	let moveXhr = null;

	map.on('moveend', x => {
		let bounds = map.getBounds();

		bikeXhr = new XMLHttpRequest();
		bikeXhr.open('GET', `/bikesInBounds?lat1=${bounds.getNorth()}&lon1=${bounds.getEast()}&lat2=${bounds.getSouth()}&lon2=${bounds.getWest()}`);
		bikeXhr.setRequestHeader('Content-Type', 'application/json');
		bikeXhr.onload = () => {
			const data = JSON.parse(bikeXhr.responseText);
			console.log(data);

			markers.clearLayers();
			data.forEach(bikePoint => {
				L.marker([bikePoint.lat, bikePoint.lon]).addTo(markers).bindPopup(addBikeMarker(bikePoint));
			});
		}
		bikeXhr.send();
		
	});
};
