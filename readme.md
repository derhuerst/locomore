# locomore

**A JavaScript client for the Locomore API.**

Deprecated. [Locomore has filed for insolvency](https://web.archive.org/web/20170514064030/https://locomore.com/de/aktuelles/2017-05-11/) and has beend merged into [Flixtrain](https://www.flixtrain.com).

[![npm version](https://img.shields.io/npm/v/locomore.svg)](https://www.npmjs.com/package/locomore)
[![build status](https://img.shields.io/travis/derhuerst/locomore.svg)](https://travis-ci.org/derhuerst/locomore)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/locomore.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)

Things still missing:

- [schedules](https://github.com/public-transport/friendly-public-transport-format/blob/master/docs/readme.md#schedule) from [this gist](https://gist.github.com/derhuerst/410d79ce2a8158705d7878e8af096577)
- booking, seat selection :sparkles: with [comfort zones](https://locomore.com/en/basic/)
- a ClI tool


## Installing

```shell
npm install locomore
```


## Usage

### stations

The [npm package](https://npmjs.com/locomore) contains data in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

```js
const stations = require('locomore/stations.json')

console.log(stations['8011065'])
```

```js
{
	type: 'station',
	id: '8011065',
	name: 'Frankfurt (Main) Süd',
	code: 'FFS',
	timezone: 'Europe/Berlin',
	country: 'DEU',
	coordinates: {
		latitude: 50.07605700000001,
		longitude: 8.670040900000004
	}
}
```

### journeys

```js
journeys(from, to, outward = Date.now(), returning = null, opt = defeaults)
```

Using `locomore.journeys`, you can get directions and prices for routes from A to B.

```js
const locomore = require('locomore')

const BerlinHbf = '8065969'
const StuttgartHbf = '8011065'
const date = '2017-04-06'

locomore.journeys(BerlinHbf, StuttgartHbf, date)
.then(console.log)
.catch(console.error)
```

Returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/promise) that will resolve with an object with `outward` and `returning`. Both are arrays of `journey`s in the [*Friendly Public Transport Format*](https://github.com/public-transport/friendly-public-transport-format).

```js
{
	outward: [
		// journey objects
	],
	returning: [
		// journey objects
	]
}
```

A `journey` looks as follows. Note that the legs are not fully spec-compatible, as the `schedule` is missing.

```js
[
	{
		type: 'journey',
		id: 's1819_2017-04-06_BLS_FFS',
		legs: [ {
			id: 's1819_2017-04-06_BLS_FFS-s1819_2017-04-06_BLS_FFS',
			serviceId: '1818|2017-04-06',
			origin: '8065969',
			destination: '8011065',
			departure: '2017-04-06T14:54:00+0200',
			arrival: '2017-04-06T19:35:00+0200',
			departurePlatform: '13',
			arrivalPlatform: '7',
			mode: 'train',
			public: true,
			operator: {
				type: 'operator',
				id: 'locomore',
				name: 'Locomore'
			}
		}],
		price: {
			id: 'bundle-s1819_2017-04-06_BLS_FFS-953448966',
			amount: 27,
			currency: 'EUR',
			business: false,
			available: 2
		}
	}
]
```

----

`defaults`, partially overridden by the `opt` parameter, looks like this:

```js
const defaults = {
	passengers: [
		{type: 'adult', wheelchair: false, merkzeichenB: false}
	],
	currency: 'EUR',
	business: false
}
```

### more journey details

To get more details for a journey, use `locomore.journeyDetails`. Pass in an array of service IDs (from `journeys.legs[n].serviceID`) or `journey` objects.

```js
locomore.journeys(BerlinHbf, StuttgartHbf, date)
.then((data) => journeyDetails(data.outward))
.then(console.log)
.catch(console.error)
```

You will get an object like this:

```js
[
	{ // first journey
		via: [ // passed stations
			{
				type: 'station',
				id: '8003004',
				name: 'Berlin Ostbahnhof',
				code: 'BHF',
				timezone: 'Europe/Berlin',
				country: null,
				departure: '2017-03-30T14:42:00+0200',
				arrival: '2017-03-30T14:41:00+0200',
				departurePlatform: '7',
				arrivalPlatform: '7'
			},
			// …
			{
				type: 'station',
				id: '8029009',
				name: 'Vaihingen (Enz)',
				code: 'TV',
				timezone: 'Europe/Berlin',
				country: null,
				departure: '2017-03-30T21:03:00+0200',
				arrival: '2017-03-30T21:02:00+0200',
				departurePlatform: '2',
				arrivalPlatform: '2'
			}
		]
	}
]
```


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/locomore/issues).
