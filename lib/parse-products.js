'use strict'

const createParseProducts = (hafas) => {
	if (!hafas || !hafas.profile || !Array.isArray(hafas.profile.products)) {
		throw new Error('invalid profile passed')
	}

	const allProducts = hafas.profile.products
	const defaultProducts = Object.create(null)
	for (let p of allProducts) defaultProducts[p.id] = !!p.default

	const parseProducts = (str) => {
		if (!str) return Object.assign({}, defaultProducts)

		const res = Object.create(null)
		for (let p of str.split(/,\s*/)) {
			p = p.trim()
			if (!allProducts.some(product => product.id === p)) res[p] = true
		}
		return res
	}

	return parseProducts
}

module.exports = createParseProducts
