'use strict'

const pify = require('pify')
const locate = require('@derhuerst/location')
const chalk = require('chalk')

const _parseWhen = require('./lib/parse-when')
const _parseProducts = require('./lib/parse-products')
const _queryCloseStations = require('./lib/query-close-stations')
const _queryLocation = require('./lib/query-location')
const _queryWhen = require('./lib/query-when')
const _queryProducts = require('./lib/query-products')
const _queryNrOfResults = require('./lib/query-nr-of-results')
const _renderJourneyDetails = require('./lib/render-journey-details')
const _queryJourney = require('./lib/query-journey')

const pLocate = pify(locate)

const defaults = {
	productColor: p => '#888888',
	productSymbol: p => null,
	lineColor: l => '#888888',
	showLocationIds: false,
	showTripIds: false
}

const setup = (hafas, opt = {}) => {
	opt = Object.assign({}, defaults, opt)

	const parseWhen = _parseWhen(hafas, opt)
	const parseProducts = _parseProducts(hafas, opt)
	const queryCloseStations = _queryCloseStations(hafas, opt)
	const queryWhen = _queryWhen(hafas, opt)
	const queryLocation = _queryLocation(hafas, opt)
	const queryProducts = _queryProducts(hafas, opt)
	const queryResults = _queryNrOfResults(hafas, opt)
	const renderJourneyDetails = _renderJourneyDetails(hafas, opt)
	const queryJourney = _queryJourney(hafas, opt)

	return async function journeys(cfg) {
		let origin, destination, when, nrOfResults, products

		// query the station of departure
		if (cfg.origin) {
			origin = cfg.origin
		} else if (cfg.useCurrentLocation) {
			origin = await queryCloseStations('From where?', await pLocate())
		} else {
			origin = await queryLocation('From where?')
		}

		// query the destination
		if (cfg.destination) {
			destination = cfg.destination
		} else if (cfg.useCurrentLocation) {
			destination = await queryCloseStations('To where?', await pLocate())
		} else {
			destination = await queryLocation('To where?')
		}

		// query date & time
		if (cfg.queryWhen) {
			when = await queryWhen('When?')
		} else if (cfg.when) {
			when = parseWhen(cfg.when)
		} else {
			when = new Date()
		}

		// nr of journeys
		if (cfg.queryResults) {
			nrOfResults = await queryResults('How many journeys?', 4)
		} else {
			nrOfResults = cfg.nrOfResults || 4
		}

		// means of transport
		if (cfg.queryProducts) {
			products = await queryProducts('Which means of transport?')
		} else {
			products = parseProducts(cfg.products)
		}

		const {journeys} = await hafas.journeys(origin, destination, {
			departure: when, results: nrOfResults, products
		})
		let journey
		if (journeys.length === 1) journey = journeys[0]
		else journey = await queryJourney('Which journey?', journeys)

		process.stdout.write(renderJourneyDetails(journey) + '\n')
	}
}

module.exports = setup
