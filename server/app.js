/**
 * Created by sojharo on 20/07/2017.
 */
import path from 'path'

process.env.NODE_ENV = process.env.NODE_ENV || 'development' // production

const express = require('express')
const mongoose = require('mongoose')

const config = require('./config/environment/index')

const app = express()
const httpApp = express()
httpApp.use(express.static(path.resolve(__dirname, '../broadcastfiles')))

mongoose.connect(config.mongo.uri, config.mongo.options)

const appObj = (config.env === 'production') ? app : httpApp

require('./config/express')(appObj)
require('./routes')(appObj)
require('./config/setup')(app, httpApp, config)
