'use strict'

const test = require('tape')
const isRoughlyEqual = require('is-roughly-equal')

const stations = require('./stations.json')

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
