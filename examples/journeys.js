'use strict'

const util = require('util')

const journeys = require('../lib/journeys')

const BerlinHbf = '8065969'
const StuttgartHbf = '8011065'
const forth = '2017-04-06'
const back = '2017-04-08'

journeys(BerlinHbf, StuttgartHbf, forth, back)
.then((journeys) => {
	console.log(util.inspect(journeys, {depth: Infinity}))
})
.catch(console.error)
