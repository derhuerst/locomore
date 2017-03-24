'use strict'

const test = require('tape')
const isRoughlyEqual = require('is-roughly-equal')
const moment = require('moment-timezone')

const stations = require('./stations.json')
const journeys = require('./lib/journeys')
const journeyDetails = require('./lib/journey-details')

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

const validateStation = (t) => (station) => {
	t.equal(station.type, 'station')
	t.ok(validId.test(station.id), id + ' has an invalid id')
	t.equal(typeof station.name, 'string', id + ' has an invalid name')
	t.equal(typeof station.timezone, 'string', id + ' has an invalid timezone') // todo
	t.equal(typeof station.country, 'string', id + ' has an invalid country') // todo

	if (station.coordinates) {
		t.ok(isRoughlyEqual(3, station.coordinates.latitude, 50))
		t.ok(isRoughlyEqual(3, station.coordinates.longitude, 10))
	}
}

test('stations.json – all', (t) => {
	for (let id in stations) validateStation(t, stations[id])
	t.end()
})

const validateJourney = (t) => (journey, i) => {
	t.test('journey ' + i, (t) => {
		t.equal(journey.type, 'journey')
		t.equal(typeof journey.id, 'string')

		journey.legs.forEach((leg, i) => t.test('leg ' + i, (t) => {
			t.equal(typeof leg.id, 'string')
			t.equal(typeof leg.serviceId, 'string')
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

test('journeys – Berlin to Stuttgart on Thursday', (t) => {
	const BerlinHbf = '8065969'
	const StuttgartHbf = '8011065'

	const thursday = moment.tz('Europe/Berlin').add(1, 'weeks').weekday(4)
	const saturday = moment(thursday).weekday(6)

	journeys(BerlinHbf, StuttgartHbf, +thursday, +saturday)
	.then(({outward, returning}) => {
		t.ok(Array.isArray(outward))
		outward.forEach(validateJourney(t))

		t.ok(Array.isArray(returning))
		returning.forEach(validateJourney(t))

		t.end()
	})
	.catch(t.ifError)
})

test('journeys – fetches outward if only one date passed', (t) => {
	const BerlinHbf = '8065969'
	const StuttgartHbf = '8011065'
	const thursday = moment.tz('Europe/Berlin').add(1, 'weeks').weekday(4)

	journeys(BerlinHbf, StuttgartHbf, +thursday)
	.then(({outward, returning}) => {
		t.ok(outward.length > 0)
		t.equal(returning.length, 0)

		t.end()
	})
	.catch(t.ifError)
})

const validateJourneyDetails = (t) => (details, i) => {
	t.test('journey details ' + i, (t) => {
		t.ok(Array.isArray(details.via))

		for (let passed of details.via) {
			validateStation(passed)

			t.ok(!isNaN(new Date(passed.departure)))
			if (passed.departurePlatform) {
				t.equal(typeof passed.departurePlatform, 'string')
			}

			t.ok(!isNaN(new Date(passed.arrival)))
			if (passed.arrivalPlatform) {
				t.equal(typeof passed.arrivalPlatform, 'string')
			}
		}

		t.end()
	})
}

test('journeyDetails – Berlin to Stuttgart on Thursday', (t) => {
	const BerlinHbf = '8065969'
	const StuttgartHbf = '8011065'

	const thursday = moment.tz('Europe/Berlin').add(1, 'weeks').weekday(4)

	journeys(BerlinHbf, StuttgartHbf, +thursday)
	.then(({outward}) => journeyDetails(outward))
	.then((details) => {
		t.ok(Array.isArray(details))
		t.ok(details.length > 0)

		details.forEach(validateJourneyDetails(t))

		t.end()
	})
	.catch(t.ifError)
})
