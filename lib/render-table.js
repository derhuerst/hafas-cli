'use strict'

// const maxBy = require('lodash.maxby')
// const objToTable = require('obj-to-table')
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

// const renderTable = (rows) => {
// 	const columns = maxBy(rows, r => r.length).length
// 	const res = []

// 	for (let row of rows) {
// 		const rowObj = Object.create(null)
// 		for (let i = 0; i < Math.max(row.length, columns); i++) {
// 			rowObj[i] = row[i] || ''
// 		}
// 		res.push(rowObj)
// 	}

// 	console.error(res)
// 	return objToTable(rows) + ''
// }

const renderTable = (rows) => {
	const table = new Table(tableOpts)
	for (let row of rows) table.push(row)
	return table + ''
}

module.exports = renderTable
