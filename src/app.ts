import express, { Application } from 'express'

import playListRoute from './playlist'

import communityRoute from './community'

import userRoute from './user'

const app: Application = express()

app.use(express.json())

app.use('/play-list', playListRoute)

app.use('/community', communityRoute)

app.use('/user', userRoute)

module.exports = app
