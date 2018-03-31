'use strict'

const chalk = require('chalk')
const ms = require('ms')
const selectPrompt = require('select-prompt')

const renderDur = require('./render-duration')
const _renderTime = require('./render-time')
const _renderTransport = require('./render-transport')

const createQueryJourney = (hafas, opt) => {
	if (
		!hafas ||
		!hafas.nearby ||
		!hafas.profile.timezone ||
		!hafas.profile.locale
	) {
		throw new Error('invalid hafas client passed.')
	}
	const renderTime = _renderTime(hafas.profile.timezone, hafas.profile.locale)

	const renderTransport = _renderTransport(opt)

	const renderJourneySummary = (j) => {
		const l = j.legs
		const first = l[0]
		const last = l[l.length - 1]
		return [
			l.map(renderTransport).join(chalk.gray(', ')),
			' ',
			chalk.yellow(renderDur(last.arrival, first.departure)),
			'   ',
			chalk.gray(renderTime(first.departure) + '–' + renderTime(last.arrival))
		].join('')
	}

	const queryJourney = (msg, journeys) => {
		return new Promise((resolve, reject) => {
			const choices = journeys
			.map(j => ({
				title: renderJourneySummary(j),
				value: j
			}))

			selectPrompt(msg, choices)
			.on('submit', resolve)
			.on('abort', val => reject(new Error(`Rejected with ${val}.`)))
		})
	}

	return queryJourney
}

module.exports = createQueryJourney
