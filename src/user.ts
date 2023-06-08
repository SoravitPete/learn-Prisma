import { PrismaClient } from '@prisma/client'
import express, {NextFunction, Request, Response } from 'express'
import * as Joi from "joi";

const prisma = new PrismaClient()

const userRoute = express.Router()

userRoute.get('/', (req: Request, res: Response) => {
    console.log('Test1')
    res.send("Test1")
})

userRoute.get('/all', async (req: Request, res: Response) => {
    const users = await prisma.user.findMany()
    console.log(users)
    res.send(users)
})

userRoute.post('/', async (req: Request, res: Response) => {
    const schema = Joi.object({
        name : Joi.string().required(),
        email : Joi.string().email().required()
    })
    var test = schema.validate({name : req.body.name, email : req.body.email})
    if (!test.error){
      const user = await prisma.user.create({
          data: {
            name: req.body.name,
            email: req.body.email,
          },
        })
      console.log(user)
      res.send(user)
    }
    else{
      console.log("error na kub")
      res.json({massage : "error na kub"})
    }

    try {
      await schema.validateAsync({
        name : req.body.name, email : req.body.email
      })
    }
    catch (err) {
      reportError({massage: "error na kub"})
    }
    
})

userRoute.get('/:id', async (req: Request, res: Response) => {
    const find_ID = await prisma.user.findUnique({
        where : {
          id: parseInt(req.params.id)
        }
      })
      console.log(find_ID)
    res.send(find_ID)
})

export default userRoute