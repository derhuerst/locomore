'use strict'

const got = require('got')
const Cache = require('cache-conf')

const auth = 'XzR6a3FmdDJ3cm8wOHc0a2tzMGdzMGs4d3c0b2c4MGc0c2M4NGtzMDh3azR3czRrb3dnOjRnaXF6YzB2aDh1ODRjZ3NndzgwczRrMGswZ3dnb3Nna2dvMGtnb2drNGtzMDRvb2Mw'

const cache = new Cache()

const fetchNewToken = () =>
	got('https://booking.locomore.com/oauth/v2/token', {
		method: 'POST',
		json: true,
		headers: {
			authorization: 'Basic ' + auth,
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			grant_type: 'https://com.sqills.s3.oauth.public',
			code: 'xw4Irmc9RvOFV13vh02x5ZC205PAOc11'
		})
	})
	.then((res) => ({
		token: res.body.access_token,
		expires: res.body.expires_in
	}))

const fetchToken = () => {
	const token = cache.get('token')

	if (!token) {
		return fetchNewToken()
		.then(({token, expires}) => {
			cache.set('token', token, {maxAge: expires * 1000 - 10})
			return token
		})
	}

	return Promise.resolve(token)
}

module.exports = fetchToken
