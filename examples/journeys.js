'use strict'

const moment = require('moment-timezone')
const util = require('util')

const journeys = require('../lib/journeys')

const BerlinHbf = '8065969'
const StuttgartHbf = '8011065'
const thursday = moment.tz('Europe/Berlin').add(1, 'weeks').weekday(4)
const saturday = moment(thursday).weekday(6)

journeys(BerlinHbf, StuttgartHbf, +thursday, +saturday)
.then(({outward, returning}) => {
	console.log(util.inspect(outward, {depth: Infinity}))
	console.log(util.inspect(returning, {depth: Infinity}))
})
.catch(console.error)
