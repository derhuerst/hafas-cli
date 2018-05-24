'use strict'

const selectPrompt = require('select-prompt')

const createQueryCloseStations = (hafas, opt) => {
	if (!hafas || !hafas.nearby) {
		throw new Error('invalid hafas client passed.')
	}

	const queryCloseStations = (msg, {latitude, longitude}) => {
		return hafas.nearby({
			type: 'location',
			latitude: latitude,
			longitude: longitude,
			results: 3
		})
		.then((stations) => new Promise((resolve, reject) => {
			const choices = stations
			.slice(0, 10)
			.map(s => {
				let title = s.name
				if (opt.showLocationIds) title += ' – ' + s.id
				return {title, value: s.id}
			})

			selectPrompt(msg, choices)
			.on('submit', resolve)
			.on('abort', val => reject(new Error(`Rejected with ${val}.`)))
		}))
	}

	return queryCloseStations
}

module.exports = createQueryCloseStations
