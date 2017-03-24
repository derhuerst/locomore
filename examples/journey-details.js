'use strict'

const moment = require('moment-timezone')
const util = require('util')

const journeys = require('../lib/journeys')
const journeyDetails = require('../lib/journey-details')

const BerlinHbf = '8065969'
const StuttgartHbf = '8011065'
const thursday = moment.tz('Europe/Berlin').add(1, 'weeks').weekday(4)

journeys(BerlinHbf, StuttgartHbf, +thursday)
.then(({outward}) => journeyDetails(outward))
.then((details) => {
	console.log(util.inspect(details, {depth: Infinity}))
})
.catch(console.error)
