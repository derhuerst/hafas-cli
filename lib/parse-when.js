'use strict'

const parseMessyTime = require('parse-messy-time')

const createParseWhen = () => {
	// todo: pick something timezone-aware
	const parseWhen = str => parseMessyTime(str)

	return parseWhen
}

module.exports = createParseWhen
