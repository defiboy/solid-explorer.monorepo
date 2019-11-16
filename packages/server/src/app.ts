import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'

import express from '@feathersjs/express'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio'

import configuration from '@feathersjs/configuration'

import appHooks from './app.hooks'
import channels from './channels'
import { Application } from './declarations'
import { logger } from './logger'
import middleware from './middleware'
import services from './services'
// Don't remove this comment. It's needed to format import lines nicely.

import blockchainSynchronizer from './blockchain.synchronizer'
import sequelize from './sequelize'

const app: Application = express(feathers())

app.configure(configuration())

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(cors())
app.use(compress())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.get('/', (req, res) => {
  res.send('Solid Server Up & Running!')
})

// Set up Plugins and providers
app.configure(express.rest())
app.configure(socketio())

app.configure(sequelize)
app.configure(middleware)
app.configure(services)
app.configure(channels)
app.configure(blockchainSynchronizer)
// Configure a middleware for 404s and the error handler
app.use(express.notFound())
app.use(express.errorHandler({ logger } as any))

app.hooks(appHooks)

export { app }
