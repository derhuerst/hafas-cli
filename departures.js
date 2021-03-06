'use strict'

const pify = require('pify')
const queryLocation = require('@derhuerst/location')
const chalk = require('chalk')

const _parseWhen = require('./lib/parse-when')
const _parseProducts = require('./lib/parse-products')
const _queryCloseStations = require('./lib/query-close-stations')
const _queryStation = require('./lib/query-station')
const _queryWhen = require('./lib/query-when')
const _queryProducts = require('./lib/query-products')
const _queryDuration = require('./lib/query-duration')
const _renderDepartures = require('./lib/render-departures')

const locate = pify(queryLocation)

const defaults = {
	productColor: p => '#888888',
	lineColor: l => '#888888',
	showLocationIds: false,
	showTripIds: false
}

const createProductSymbol = (hafas) => {
	const products = Object.create(null)
	for (let p of hafas.profile.products) products[p.id] = p

	const productSymbol = p => products[p] && products[p].short || null
	return productSymbol
}

const createDeparturesCLI = (hafas, opt = {}) => {
	opt = Object.assign({
		productSymbol: createProductSymbol(hafas)
	}, defaults, opt)

	const parseWhen = _parseWhen(hafas, opt)
	const parseProducts = _parseProducts(hafas, opt)
	const queryCloseStations = _queryCloseStations(hafas, opt)
	const queryStation = _queryStation(hafas, opt)
	const queryWhen = _queryWhen(hafas, opt)
	const queryProducts = _queryProducts(hafas, opt)
	const queryDuration = _queryDuration(hafas, opt)
	const renderDepartures = _renderDepartures(hafas, opt)

	return async function departuresCLI(cfg) {
		let station, when, duration, products

		if (cfg.station) {
			station = cfg.station
		} else if (cfg.useCurrentLocation) {
			station = await queryCloseStations('Where?', await locate())
		} else {
			station = await queryStation('Where?')
		}

		// query date & time
		if (cfg.queryWhen) {
			when = await queryWhen('When?')
		} else if (cfg.when) {
			when = parseWhen(cfg.when)
		} else {
			when = new Date()
		}

		// duration
		if (cfg.queryDuration) {
			duration = await queryDuration('Show departures for how many minutes?', 15)
		} else if (cfg.duration) {
			duration = parseInt(cfg.duration)
		} else {
			duration = 15
		}

		// means of transport
		if (cfg.queryProducts) {
			products = await queryProducts('Which means of transport?')
		} else {
			products = parseProducts(cfg.products)
		}

		const departures = await hafas.departures(station, {
			when, duration, products
		})
		if (departures.length === 0) throw new Error('No departures found.')

		process.stdout.write(renderDepartures(departures) + '\n')
	}
}

module.exports = createDeparturesCLI
