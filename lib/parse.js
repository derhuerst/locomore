'use strict'

const parseStation = (s) => {
	if (!s._u_i_c_station_code) {
		throw new Error(`${s.name || s.short_code} has no UIC id`)
	}
	if (!s.name) {
		throw new Error(`${s._u_i_c_station_code || s.short_code} has no name`)
	}

	const station = {
		type: 'station',
		id: s._u_i_c_station_code,
		name: s.name,
		code: s.short_code,
		timezone: s.timezone,
		country: s.country_code
	}

	if (s.geo_data) station.coordinates = {
		latitude: parseFloat(s.geo_data.latitude),
		longitude: parseFloat(s.geo_data.longitude)
	}

	return station
}

module.exports = {
	station: parseStation
}
