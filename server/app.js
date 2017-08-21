/**
 * Created by sojharo on 20/07/2017.
 */
const path = require('path')
process.env.NODE_ENV = process.env.NODE_ENV || 'development' // production

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const config = require('./config/environment/index')

const app = express()
const httpApp = express()

// todo discuss with zarmeen
app.use(express.static(path.resolve(__dirname, '../broadcastFiles')))

mongoose.connect(config.mongo.uri, config.mongo.options)

app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
const appObj = (config.env === 'production') ? app : httpApp

require('./config/express')(appObj)
require('./routes')(appObj)
require('./config/setup')(app, httpApp, config)
