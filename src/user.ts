import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response } from 'express'
import * as Joi from "joi";

const prisma = new PrismaClient()

const userRoute = express.Router()

userRoute.get('/test', (req: Request, res: Response) => {
  console.log('Test1')
  res.send("Test1")
})

userRoute.get('/', async (req: Request, res: Response) => {
	try {
		const users = await prisma.user.findMany({
			include: {
				posts: true
			}
		})
		console.log(users)
		res.send(users)
	} catch (error) {
		res.status(404).json({ massage: "error."})
	}
})

userRoute.get('/:id', async (req: Request, res: Response) => {
  try {
		const schema = Joi.object({
			id: Joi.number().integer(),
		})
		var test = schema.validate({ id: req.params.id })
		if (!test.error) {
			const object = await prisma.user.findUnique({
				where: {
					id: parseInt(req.params.id)
				},
				include: {
					posts: true
				}
			})
			res.send(object)
		} else {
			res.status(404).json({ massgae: 'wrong format.'})
		}
	} catch (error){
		res.status(404).json({ massage: "object following by this id is not valid."})
	}
})

userRoute.put('/', async (req: Request, res: Response) => {
  try {
		const data_name = req.body.name
		const data_email = req.body.email
		const schema = Joi.object({
			name: Joi.string().alphanum().max(30).required(),
			email: Joi.string().email().required()
		})
		var validate = schema.validate({ name: req.body.name, email: req.body.email })
		if (!validate.error) {
			try {
				const updateUser = await prisma.user.update({
					where: {
						email: data_email
					},
					data: {
						name: data_name
					}
				})
				console.log(updateUser)
				res.send(updateUser)
			} catch (err) {
        throw new Error('invalid email')
			}
		} else {
			console.log("email or user name is wrong format")
			res.send('email or user name is wrong format')
		}
  } catch (error) {
    res.status(404).json({ message: 'error', error })
  }
})

userRoute.delete('/:id', async (req: Request, res: Response) => {
	try{
		const schema = Joi.object({
			id: Joi.number().integer(),
		})
		var test = schema.validate({ id: req.params.id })
		if (!test.error) {
			const deleteUser = await prisma.user.delete({
				where: {
					id: parseInt(req.params.id),
				}
			})
			res.send(deleteUser)
		} else {
			res.status(404).json({ massgae: 'wrong format.'})
		}
	} catch (err) {
		res.status(404).json({ massage: 'Cannot delete by this id'})
	}
})

userRoute.post('/', async (req: Request, res: Response) => {
	try {
		const schema = Joi.object({
			name: Joi.string().max(30).required(),
			email: Joi.string().email().required(),
			title: Joi.string().max(500).required()
		})
		var test = schema.validate({ name: req.body.name, email: req.body.email, title: req.body.title })
		if (!test.error) {
			const user = await prisma.user.create({
				data: {
					name: req.body.name,
					email: req.body.email,
					posts: {
						create: {
							title: req.body.title
						}
					}
				},
			})
			console.log(user)
			res.send(user)
		} else {
			console.log("error na kub")
			res.json({ massage: "error na kub" })
		}
	} catch (error) {
		res.status(404).json({ massage: 'Cannot create this Post'})
	}
})

export default userRoute