'use strict'

const ms = require('ms')

// todo: render delays/changes
const renderDuration = (earlier, later) => {
	const d = new Date(later) - new Date(earlier)
	if (Math.abs(d) < 1000) return '0s'
	return (d < 0 ? '-' : '') + ms(Math.abs(d))
}

module.exports = renderDuration
