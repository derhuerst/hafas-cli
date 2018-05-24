'use strict'

const chalk = require('chalk')
const ms = require('ms')

const renderTable = require('./render-table')

const unknown = chalk.gray('?')

const createRenderDepartures = (hafas, opt) => {
	if (!hafas || !hafas.profile || !hafas.profile.timezone || !Array.isArray(hafas.profile.products)) {
		throw new Error('invalid hafas client passed.')
	}
	const allProducts = hafas.profile.products

	if (!opt || 'function' !== typeof opt.productColor) {
		throw new Error('missing opt.productColor fn.')
	}
	if (!opt || 'function' !== typeof opt.lineColor) {
		throw new Error('missing opt.lineColor fn.')
	}

	const renderTimeLeft = (date) => {
		const d = new Date(date) - Date.now()
		if (Math.abs(d) < 1000) return 'now'
		return (d < 0 ? '-' : '') + ms(Math.abs(d))
	}

	const renderDepartures = (deps) => {
		const rows = []
		for (let dep of deps) {
			const row = []
			if (dep.line) {
				const l = dep.line
				const p = l.product && allProducts.find(p => p.id === l.product)
				if (p) row.push(chalk.hex(opt.productColor(p.id))(p.short))
				row.push(chalk.hex(opt.lineColor(l))(l.name))
			} else {
				row.push(unknown, unknown)
			}

			// todo: cancelled
			row.push(renderTimeLeft(dep.when))

			row.push(chalk.yellow(dep.direction))

			if (opt.showJourneyLegIds) row.push(chalk.gray(dep.journeyId || '?'))

			rows.push(row)
		}
		return renderTable(rows)
	}

	return renderDepartures
}

module.exports = createRenderDepartures
