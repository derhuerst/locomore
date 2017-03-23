'use strict'

const test = require('tape')
const isRoughlyEqual = require('is-roughly-equal')
const moment = require('moment-timezone')

const stations = require('./stations.json')
const journeys = require('./lib/journeys')

const validId = /^[\d]{7,12}$/

test('stations.json – Berlin', (t) => {
	const s = stations['8065969'] // Berlin Hbf

	t.equal(s.type, 'station')
	t.equal(s.id, '8065969')
	t.equal(s.name, 'Berlin Hbf')
	t.equal(s.timezone, 'Europe/Berlin')
	t.equal(s.country, 'DEU')

	if (s.coordinates) {
		t.ok(isRoughlyEqual(.01, s.coordinates.latitude, 52.5251))
		t.ok(isRoughlyEqual(.01, s.coordinates.longitude, 13.3672))
	}

	t.end()
})

test('stations.json – all', (t) => {
	for (let id in stations) {
		const s = stations[id]

		t.equal(s.type, 'station')
		t.ok(validId.test(s.id), id + ' has an invalid id')
		t.equal(typeof s.name, 'string', id + ' has an invalid name')
		t.equal(typeof s.timezone, 'string', id + ' has an invalid timezone') // todo
		t.equal(typeof s.country, 'string', id + ' has an invalid country') // todo

		if (s.coordinates) {
			t.ok(isRoughlyEqual(3, s.coordinates.latitude, 50))
			t.ok(isRoughlyEqual(3, s.coordinates.longitude, 10))
		}
	}
	t.end()
})

const validateJourney = (t) => (journey, i) => {
	t.test('journey ' + i, (t) => {
		t.equal(journey.type, 'journey')
		t.equal(typeof journey.id, 'string')

		journey.legs.forEach((leg, i) => t.test('leg ' + i, (t) => {
			t.equal(typeof leg.id, 'string')
			t.equal(leg.mode, 'train')
			t.equal(leg.public, true)

			t.equal(typeof leg.origin, 'string')
			t.ok(!isNaN(new Date(leg.departure)))
			if (leg.departurePlatform) t.equal(typeof leg.departurePlatform, 'string')

			t.equal(typeof leg.destination, 'string')
			t.ok(!isNaN(new Date(leg.arrival)))
			if (leg.arrivalPlatform) t.equal(typeof leg.arrivalPlatform, 'string')

			t.ok(typeof leg.operator === 'string' || typeof leg.operator.id === 'string')

			t.end()
		}))

		t.ok(journey.price)
		t.equal(typeof journey.price.amount, 'number')
		t.ok(journey.price.amount > 0)
		t.equal(journey.price.currency, 'EUR')
		t.equal(typeof journey.price.business, 'boolean')
		t.equal(typeof journey.price.available, 'number')

		t.end()
	})
}

test('journeys – Berlin to Stuttgart in 2 days', (t) => {
	const BerlinHbf = '8065969'
	const StuttgartHbf = '8011065'

	const thursday = moment.tz('Europe/Berlin').add(1, 'weeks').weekday(4)
	const saturday = moment(thursday).weekday(6)

	journeys(BerlinHbf, StuttgartHbf, +thursday, +saturday)
	.then(({forth, back}) => {
		t.ok(Array.isArray(forth))
		forth.forEach(validateJourney(t))

		t.ok(Array.isArray(back))
		back.forEach(validateJourney(t))

		t.end()
	})
	.catch(t.ifError)
})
