'use strict'

const multiselectPrompt = require('multiselect-prompt')

const createQueryProducts = (hafas) => {
	if (!hafas || !hafas.profile || !Array.isArray(hafas.profile.products)) {
		throw new Error('invalid hafas client passed.')
	}

	const defaultChoices = hafas.profile.products.map((p) => {
		return {
			title: p.short + ' (' + p.name + ')',
			value: p.id,
			selected: !!p.default
		}
	})

	const queryProducts = (msg) => {
		return new Promise((resolve, reject) => {
			multiselectPrompt(msg, defaultChoices)
			.on('submit', (chosen) => {
				const res = Object.create(null)
				for (let c of chosen) res[c.value] = !!c.selected
				resolve(res)
			})
			.on('abort', val => reject(new Error(`Rejected with ${val}.`)))
		})
	}

	return queryProducts
}

module.exports = createQueryProducts
