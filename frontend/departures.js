window.onload = () => {

	const form = document.querySelector('form');
	form.addEventListener('submit', e => {

		const resultsDiv = document.getElementById('results');
		resultsDiv.innerHTML = 'Loading...'

		const postcode = e.currentTarget[0].value;

		var xhr = new XMLHttpRequest();
		xhr.open('GET', `/departureBoard?postcode=${postcode}`, true);
		xhr.setRequestHeader('Content-Type', 'application/json');

		xhr.onload = () => {
			const data = JSON.parse(xhr.responseText);
			console.log(data);
			
			let str = `<h2>Results</h2>`;
			data.forEach(stopData => {
				str = str.concat(`<h3>${stopData.stop.name}</h3><ul>`);
				stopData.arrivals.forEach(arrival => {
					str = str.concat(
						`<li>${arrival.expectedArrivalPretty}: ${arrival.lineName} to ${arrival.destinationName}</li>`
					);
				});
				str = str.concat('</ul>')
			})
			resultsDiv.innerHTML = str; 
		}

		xhr.send();
	});

}
