'use strict'

const util = require('util')

const journeys = require('../lib/journeys')

const BerlinHbf = '8065969'
const StuttgartHbf = '8011065'
const outward = '2017-04-06'
const returning = '2017-04-08'

journeys(BerlinHbf, StuttgartHbf, outward, returning)
.then(({outward, returning}) => {
	console.log(util.inspect(outward, {depth: Infinity}))
	console.log(util.inspect(returning, {depth: Infinity}))
})
.catch(console.error)
