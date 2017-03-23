# locomore

**A JavaScript client for the Locomore API.**

[![npm version](https://img.shields.io/npm/v/locomore.svg)](https://www.npmjs.com/package/locomore)
[![build status](https://img.shields.io/travis/derhuerst/locomore.svg)](https://travis-ci.org/derhuerst/locomore)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/locomore.svg)
[![chat on gitter](https://badges.gitter.im/derhuerst.svg)](https://gitter.im/derhuerst)

Things still missing:

- [routes](https://github.com/public-transport/friendly-public-transport-format/blob/master/docs/readme.md#route), [schedules](https://github.com/public-transport/friendly-public-transport-format/blob/master/docs/readme.md#schedule), prices from [this gist](https://gist.github.com/derhuerst/410d79ce2a8158705d7878e8af096577)
- booking, seat selection :sparkles:
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


## Contributing

If you **have a question**, **found a bug** or want to **propose a feature**, have a look at [the issues page](https://github.com/derhuerst/locomore/issues).
