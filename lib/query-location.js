'use strict'

const autocompletePrompt = require('cli-autocomplete')

const createQueryLocation = (hafas, opt) => {
	if (!hafas || !hafas.locations) {
		throw new Error('invalid hafas client passed.')
	}

	// todo: support custom suggest fns
	const suggest = (query) => {
		if (query === '') return Promise.resolve([])

		return hafas.locations(query, {
			results: 7
		})
		.then((locs) => {
			return locs.map(l => {
				// todo: public-transport/hafas-client#42
				let title = l.name || l.address
				if (opt.showLocationIds && l.id) title += ' – ' + l.id
				return {title, value: l.id}
			})
		})
	}

	const queryLocation = (msg) => {
		return new Promise((resolve, reject) => {
			autocompletePrompt(msg, suggest)
			.on('submit', resolve)
			.on('abort', val => reject(new Error(`Rejected with ${val}.`)))
		})
	}

	return queryLocation
}

module.exports = createQueryLocation
