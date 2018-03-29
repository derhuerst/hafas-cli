'use strict'

const datePrompt = require('date-prompt')

const createQueryWhen = (hafas) => {
	if (!hafas || !hafas.profile || !hafas.profile.timezone) {
		throw new Error('invalid hafas client passed.')
	}

	// todo: use timezone
	const queryWhen = (msg) => {
		return new Promise((resolve, reject) => {
			datePrompt(msg)
			.on('submit', val => resolve(new Date(val)))
			.on('abort', val => reject(new Error(`Rejected with ${val}.`)))
		})
	}

	return queryWhen
}

module.exports = createQueryWhen
