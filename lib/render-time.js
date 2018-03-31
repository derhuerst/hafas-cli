'use strict'

const chalk = require('chalk')
const ms = require('ms')
const {DateTime} = require('luxon')
const pad = require('pad-right')

const createRenderTime = (timezone, locale) => {
	const renderTime = (t, delay) => {
		let str = DateTime.fromISO(t, {
			setZone: timezone,
			locale: locale
		})
		.plus({minus: delay || 0})
		.toLocaleString(DateTime.TIME_SIMPLE)
		if ('number' === typeof delay) {
			const s = Math.abs(delay) >= 1
				? (delay < 0 ? '-' : '+') + ms(Math.abs(delay) * 1000)
				: '+0'
			str += Math.abs(delay) < 10 ? chalk.green(s) : chalk.red(s)
		}
		return str
	}

	return renderTime
}

module.exports = createRenderTime
