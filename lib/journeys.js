'use strict'

const merge = require('lodash.merge')
const date = require('iso-date')
const got = require('got')

const token = require('./token')
const {passenger: serializePassenger} = require('./serialize')
const {tariff: parseTariff, journey: parseJourney} = require('./parse')

const validId = /^[\d]{7,12}$/

const defaults = {
	passengers: [
		// http://www.betanet.de/betanet/soziales_recht/Merkzeichen-B-678.html
		{type: 'adult', wheelchair: false, merkzeichenB: false}
	],
	currency: 'EUR',
	business: false
}

const journeys = (from, to, outward = Date.now(), returning = null, opt = {}) => {
	if (!validId.test(from)) throw new Error('from must be a valid id')
	if (!validId.test(to)) throw new Error('to must be a valid id')

	opt = merge({}, defaults, opt)
	if (!Array.isArray(opt.passengers)) {
		throw new Error('opt.passengers must be an array')
	}

	const body = {
		departure_date: date(outward),
		origin_station: from,
		destination_station: to,
		passengers: opt.passengers.map(serializePassenger),
		currency: opt.currency
	}
	if (returning) body.return_date = date(returning)

	return token()
	.then((token) => {
		return got('https://booking.locomore.com/api/journey-search', {
			headers: {
				authorization: 'Bearer ' + token,
				'content-type': 'application/json'
			},
			body: JSON.stringify(body),
			json: true
		})
	})
	.then((res) => {
		if (!res.body || !res.body.data || !res.body.data.journey_search) {
			throw new Error('invalid response')
		}

		return res.body.data.offer
	})
	.then((data) => {
		// todo: what is `data.product_families`?
		// const tariffs = data.comfort_zones.map(parseTariff)

		return data.travels.reduce((result, t) => {
			const parse = (target, journeys) => {
				for (let journey of journeys) {
					target.push(parseJourney(journey, opt.business))
				}
			}

			if (t.direction === 'outward') parse(result.outward, t.routes)
			else if (t.direction === 'return') parse(result.returning, t.routes)

			return result
		}, {outward: [], returning: []})
	})
}

module.exports = journeys
