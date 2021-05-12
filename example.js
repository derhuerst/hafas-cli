'use strict'

const createHafas = require('hafas-client')
const hvvProfile = require('hafas-client/p/hvv')
const createDeparturesCLI = require('./departures')
const createJourneysCLI = require('./journeys')

const hafas = createHafas(hvvProfile, 'hafas-cli demo')
const departuresCLI = createDeparturesCLI(hafas)
const journeysCLI = createJourneysCLI(hafas)

;(async () => {

	console.error('departures CLI')
	await departuresCLI({})

	console.error('\njourneys CLI')
	await journeysCLI({})
})()
.catch((err) => {
	console.error(err)
	process.exit(1)
})
