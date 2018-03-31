'use strict'

const {walking} = require('fptf-mode-emojis')
const chalk = require('chalk')

const createRenderTransport = (opt) => {
	if ('function' !== typeof opt.productSymbol) {
		throw new Error('missing opt.productSymbol.')
	}

	const renderTransport = (leg) => {
		if (leg.mode === 'walking') return walking
		if (leg && leg.line && leg.line.product) {
			const s = opt.productSymbol(leg.line.product)
			if (s) return chalk.hex(opt.productColor(leg.line.product))(s)
		}
		return chalk.gray('?')
	}
	return renderTransport
}

module.exports = createRenderTransport
