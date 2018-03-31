'use strict'

const chalk = require('chalk')
const pad = require('pad-right')

const renderDur = require('./render-duration')
const _renderTime = require('./render-time')
const _renderTransport = require('./render-transport')
const renderTable = require('./render-table')

const bar  = chalk.gray('|')
const node = chalk.gray('•')
const arrow = chalk.gray('-> ')

const createRenderJourneyDetails = (hafas, opt) => {
	if (
		!hafas ||
		!hafas.profile ||
		!hafas.profile.timezone ||
		!hafas.profile.locale
	) {
		throw new Error('invalid hafas client passed.')
	}
	const renderTime = _renderTime(hafas.profile.timezone, hafas.profile.locale)

	if (!opt || 'function' !== typeof opt.productColor) {
		throw new Error('missing opt.productColor fn.')
	}
	if (!opt || 'function' !== typeof opt.lineColor) {
		throw new Error('missing opt.lineColor fn.')
	}

	const renderTransport = _renderTransport(opt)

	const renderLine = (l) => {
		// todo
		if (l.product) return chalk.hex(opt.lineColor(l))(l.name)
		return l.name
	}

	const renderLeg = (rows, l, i, legs) => {
		if (i === 0) {
			rows.push([
				node,
				// todo: cancelled?
				chalk.cyan(renderTime(l.departure, l.departureDelay)),
				// todo: nice emojis for location types
				chalk.green(l.origin && l.origin.name || l.origin.address)
			])
		}

		const row = [
			bar,
			(
				chalk.yellow(renderDur(l.departure, l.arrival)) +
				' ' +
				renderTransport(l) + (l.line ? ' ' + renderLine(l.line) : '')
			),
			l.direction ? arrow + l.direction : ''
		]
		const nL = legs[i + 1]
		if (i > 0 && nL) {
			const dur = renderDur(l.arrival, nL.departure)
			row.push(chalk.gray(dur + ' waiting'))
		}
		rows.push(row)

		rows.push([
			node,
			chalk.cyan(renderTime(l.arrival, l.arrivalDelay)),
			chalk.green(l.destination && l.destination.name || l.destination.address)
		])
		return rows
	}

	const renderJourneyDetails = (journey) => {
		const rows = journey.legs.reduce(renderLeg, [])
		for (let row of rows) {
			console.error(row.map(require('strip-ansi')))
		}
		return renderTable(rows)
	}

	return renderJourneyDetails
}

module.exports = createRenderJourneyDetails
