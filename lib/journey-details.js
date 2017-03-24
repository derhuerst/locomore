'use strict'

const flatten = require('q-flat')
const got = require('got')

const token = require('./token')
const {passedStation: parsePassedStation} = require('./parse')

const validServiceId = /^[\d]+\|[\d-]+$/

const serializeJourneys = (all, journey) => {
	if (validServiceId.test(journey)) {
		return all.concat(journey)
	} else if (journey.legs) {
		const ids = journey.legs.map((leg) => leg.serviceId)
		return all.concat(ids)
	} else throw new Error('journey must be a service id or a journey')
}

const journeyDetails = (journeys) => {
	if (!Array.isArray(journeys)) throw new Error('journeys must be an array')
	if (journeys.length === 0) throw new Error('journeys must have one or more items')

	const query = flatten({
		service_identifiers: journeys.reduce(serializeJourneys, [])
	})

	return token()
	.then((token) => {
		return got('https://booking.locomore.com/api/journey-details', {
			headers: {
				authorization: 'Bearer ' + token
			},
			query,
			json: true
		})
	})
	.then((res) => {
		if (!res.body || !res.body.data || !res.body.data.services) {
			throw new Error('invalid response')
		}

		return res.body.data.services.map((details) => ({
			// todo: details.name
			via: details.via_stations.map(parsePassedStation)
		}))
	})
}

module.exports = journeyDetails
