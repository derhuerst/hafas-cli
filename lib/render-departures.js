'use strict'

const chalk = require('chalk')
const ms = require('ms')
const Table = require('cli-table2')

const tableOpts = {
	chars: {
		top:    '', 'top-mid':    '', 'top-left':    '', 'top-right':    '',
		bottom: '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
		left:   '', 'left-mid':   '',  mid:          '', 'mid-mid':      '',
		right:  '', 'right-mid':  '',  middle:       ' '
	},
	style: {'padding-left': 0, 'padding-right': 0}
}

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
		const table = new Table(tableOpts)
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

			table.push(row)
		}
		return table + ''
	}

	return renderDepartures
}

module.exports = createRenderDepartures
