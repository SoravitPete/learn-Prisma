import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response } from 'express'
import * as Joi from 'joi'

const prisma = new PrismaClient()

const userRoute = express.Router()

userRoute.get('/test', (req: Request, res: Response) => {
  res.send('Test1')
})

userRoute.get('/', async (req: Request, res: Response) => { //get all user's information
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: true
      }
    })
    res.send(users)
    return
  } catch (error) {
    res.status(404).json({ massage: 'error.' })
    return
  }
})

userRoute.get('/:id', async (req: Request, res: Response) => { //get user infomation for specific id
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
      if (object == null) {
        console.log("test_bug1")
        res.status(404).json({ massage: "couldnt find user by this id" })
        return
      }
      res.send(object)
    } else {
      console.log("test_bug2")
      res.status(404).json({ massgae: 'wrong format.' })
    }
  } catch (error) {
    console.log("test_bug3")
    res.status(404).json({ massage: 'object following by this id is not valid.' })
  }
})

userRoute.put('/', async (req: Request, res: Response) => { //change name of user
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
        res.json({ massage : updateUser})
      } catch (err) {
        throw new Error('invalid email')
      }
    } else {
      res.json({ massage: 'email or user name is wrong format'})
    }
  } catch (error) {
    res.status(404).json({ message: 'error', error })
  }
})

userRoute.delete('/:id', async (req: Request, res: Response) => { //delete user by user id
  try {
    const schema = Joi.object({
      id: Joi.number().integer(),
    })
    var test = schema.validate({ id: req.params.id })
    console.log("test init")
    if (!test.error) {
      console.log("test gg")
      const deleteAllPost = await prisma.post.deleteMany({
        where: {
            authorId: parseInt(req.params.id)
        }
      })
      const deleteUser = await prisma.user.delete({
        where: {
          id: parseInt(req.params.id),
        }
      })
      console.log("test_bug_state 1")
      res.json({ userdata: deleteUser, postdata: deleteAllPost})
    } else {
      console.log("test_bug_state 2")
      res.status(404).json({ massgae: 'wrong format.' })
    }
  } catch (err) {
    console.log("test_bug_state 3")
    res.status(404).json({ massage: 'Cannot delete by this id' })
  }
})

userRoute.post('/', async (req: Request, res: Response) => { //create user.
  try {
    const schema = Joi.object({
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
    })
    var test = schema.validate({ name: req.body.name, email: req.body.email })
    if (!test.error) {
      const user = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
        },
      })
      console.log("test_bug_state 1")
      res.json({data: user})
    } else {
      console.log("test_bug_state 2")
      res.json({ massage: 'error na kub' })
    }
  } catch (error) {
    console.log(error)
    console.log("test_bug_state 3")
    res.status(404).json({ massage: 'Cannot create this Post' })
  }
})

// userRoute.put('/post/:user_id', async (req: Request, res: Response) => { //create post for specific user.
//   try {
//     const data = req.params.user_id
//     const schema = Joi.object({
//       id: Joi.number().integer().required(),
//       title: Joi.string().max(500).required()
//     })
//     const test = schema.validate({ id: data, title: req.body.title })
//     if (!test.error) {
//       const create_post = await prisma.user.update({
//         where: {
//           id: parseInt(data)
//         },
//         data: {
//           posts: {
//             create: {
//               title: req.body.title
//             }
//           }
//         }
//       })
//       res.send(create_post)
//     } else {
//       res.status(404).json({ massage: "cannot create post by following user id" })
//     }
//   } catch (error) {
//     res.status(404).json({ massage: "Create post error" })
//   }
// })

export default userRoute