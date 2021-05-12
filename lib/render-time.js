'use strict'

const chalk = require('chalk')
const ms = require('ms')
const {DateTime} = require('luxon')
const pad = require('pad-right')

const createRenderTime = (timezone, locale) => {
	const renderTime = (t, delay, opt = {}) => {
		const {
			onTimeWithColor,
		} = {
			onTimeWithColor: true,
			...opt,
		}

		let str = DateTime.fromISO(t, {
			setZone: timezone,
			locale: locale
		})
		.minus({seconds: 'number' === typeof delay ? delay : 0})
		.toLocaleString(DateTime.TIME_SIMPLE)
		if ('number' === typeof delay) {
			const s = Math.abs(delay) >= 1
				? (delay < 0 ? '-' : '+') + ms(Math.abs(delay) * 1000)
				: '+0'
			str += Math.abs(delay) < 10
				? (onTimeWithColor ? chalk.green(s) : s)
				: chalk.red(s)
		}
		return str
	}

	return renderTime
}

module.exports = createRenderTime
