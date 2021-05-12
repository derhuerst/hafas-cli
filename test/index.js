'use strict'

const {strictEqual: eql} = require('assert')
const chalk = require('chalk')
const createRenderTime = require('../lib/render-time')

const renderTime = createRenderTime('Europe/Berlin', 'de-DE')
eql(renderTime('2021-05-11T11:01+02:00', 120), `10:59${chalk.red('+2m')}`)
