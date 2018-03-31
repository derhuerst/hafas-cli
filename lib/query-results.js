'use strict'

const numberPrompt = require('number-prompt')

const createQueryResults = () => {
	const queryResults = (msg, defaultNr) => {
		return new Promise((resolve, reject) => {
			numberPrompt(msg, {
				min: 1,
				max: 20,
				value: defaultNr
			})
			.on('submit', resolve)
			.on('abort', val => reject(new Error(`Rejected with ${val}.`)))
		})
	}

	return queryResults
}

module.exports = createQueryResults
