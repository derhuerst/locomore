'use strict'

const serializePassenger = (p) => {
	if (!p.type) throw new Error('passenger must have a type')

	let type = p.type
	if (p.type === 'adult') type = 'A'
	else if (p.type === 'child') type = 'C_R'
	else if (p.type === 'small-child') type = 'C_F'

	let disability = p.merkzeichenB ? 'B' : 'NH'
	if (p.wheelchair) disability = p.merkzeichenB ? 'WHB' : 'WH'

	// todo: discount_cards
	return {type, disability_type: disability}
}

module.exports = {
	passenger: serializePassenger
}
