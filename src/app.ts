import express, { Application } from 'express'

import playListRoute from './playlist'

import communityRoute from './community'

const app: Application = express()

app.use(express.json())

app.use('/play-list', playListRoute)

app.use('/community', communityRoute)

module.exports = app
