'use strict'

const numberPrompt = require('number-prompt')

const createQueryNrOfResults = () => {
	const queryNrOfResults = (msg, defaultNr) => {
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

	return queryNrOfResults
}

module.exports = createQueryNrOfResults
