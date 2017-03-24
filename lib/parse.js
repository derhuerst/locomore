'use strict'

const OPERATOR = {type: 'operator', id: 'locomore', name: 'Locomore'}

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
		country: s.country_code || null
	}

	if (s.geo_data) station.coordinates = {
		latitude: parseFloat(s.geo_data.latitude),
		longitude: parseFloat(s.geo_data.longitude)
	}

	return station
}

const parseJourneyLeg = (leg) => ({
	id: leg.id,
	origin: parseStation(leg.departure_station).id,
	destination: parseStation(leg.arrival_station).id,
	departure: leg.departure_station.departure_timestamp,
	arrival: leg.arrival_station.arrival_timestamp,
	departurePlatform: leg.departure_station.departure_platform,
	arrivalPlatform: leg.arrival_station.arrival_platform,
	mode: 'train',
	public: true,
	operator: OPERATOR
	// todo: schedule
	// todo: what is `leg.service_schedule_date`?
	// todo: what is `leg.service_type`?
	// todo: what is `leg.service_properties`?
	// todo: what is `leg.service_identifier`?
})

const findCheapestPrice = (bundles, business) => {
	let cheapest = {price: Infinity}

	for (let bundle of bundles) {
		const isBusiness = bundle.required_products.some((p) => p.code === 'BUS')
		if (business && !isBusiness) continue
		if (bundle.price < cheapest.price) {
			cheapest = bundle
			cheapest.isBusiness = isBusiness
		}
	}

	return {
		id: cheapest.id,
		amount: cheapest.price,
		currency: 'EUR', // todo: pick up from requesting fn
		business: cheapest.isBusiness,
		available: cheapest.availability
	}
}

const parseJourney = (journey, business) => ({
	type: 'journey',
	id: journey.id,
	legs: journey.legs.map(parseJourneyLeg),
	// todo: what is `journey.transfers`?
	price: findCheapestPrice(journey.bundles, business)
})

module.exports = {
	station: parseStation,
	journey: parseJourney
}
