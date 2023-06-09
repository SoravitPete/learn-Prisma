import express, { Application } from 'express'

import playListRoute from './playlist'

import communityRoute from './community'

import userRoute from './user'

import postRoute from './post' 

const app: Application = express()

app.use(express.json())

app.use('/play-list', playListRoute)

app.use('/community', communityRoute)

app.use('/user', userRoute)

app.use('/post', postRoute)

module.exports = app
