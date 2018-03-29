'use strict'

const numberPrompt = require('number-prompt')

const createQueryDuration = () => {
	const queryDuration = (msg, defaultDuration) => {
		return new Promise((resolve, reject) => {
			numberPrompt(msg, {
				min: 1,
				max: 150,
				value: defaultDuration
			})
			.on('submit', resolve)
			.on('abort', val => reject(new Error(`Rejected with ${val}.`)))
		})
	}

	return queryDuration
}

module.exports = createQueryDuration
