'use strict'

const got = require('got')

const token = require('../lib/token')
const {station: parseStation} = require('../lib/parse')

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

token()
.then((token) => {
	return got('https://booking.locomore.com/api/stations', {
		json: true,
		headers: {
			authorization: 'Bearer ' + token
		}
	})
	.then((res) => res.body)
})
.then((data) => {
	const stations = {}

	for (let s of data) {
		const station = parseStation(s)
		stations[station.id] = station

		// todo: connected stations
	}

	process.stdout.write(JSON.stringify(stations))
})
.catch(showError)
