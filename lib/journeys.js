'use strict'

const date = require('iso-date')
const got = require('got')

const token = require('./token')
const {tariff: parseTariff, journey: parseJourney} = require('./parse')

const validId = /^[\d]{7,12}$/

const defaults = {
	passengers: [{type: 'A'}], // todo: disability_type, discount_cards
	currency: 'EUR',
	business: false
}

const journeys = (from, to, forth = Date.now(), back = null, opt = {}) => {
	if (!validId.test(from)) throw new Error('from must be a valid id')
	if (!validId.test(to)) throw new Error('to must be a valid id')
	opt = Object.assign({}, defaults, opt)

	const body = {
		departure_date: date(forth),
		origin_station: from,
		destination_station: to,
		passengers: opt.passengers,
		currency: opt.currency
	}
	if (back) body.return_date = date(back)

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

			if (t.direction !== 'outward') parse(result.forth, t.routes)
			else if (t.direction !== 'return') parse(result.back, t.routes)

			return result
		}, {forth: [], back: []})
	})
}

module.exports = journeys
