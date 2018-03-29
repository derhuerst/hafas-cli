'use strict'

const autocompletePrompt = require('cli-autocomplete')

const createQueryStation = (hafas) => {
	if (!hafas || !hafas.locations) {
		throw new Error('invalid hafas client passed.')
	}
	// todo: support custom suggest fns
	const suggest = (query) => {
		if (query === '') return Promise.resolve([])

		return hafas.locations(query, {
			results: 5,
			addresses: false,
			poi: false
		})
		.then((stations) => {
			return stations.map(s => ({title: s.name + ' – ' + s.id, value: s.id}))
		})
	}

	const queryStation = (msg) => {
		return new Promise((resolve, reject) => {
			autocompletePrompt(msg, suggest)
			.on('submit', resolve)
			.on('abort', val => reject(new Error(`Rejected with ${val}.`)))
		})
	}

	return queryStation
}

module.exports = createQueryStation
