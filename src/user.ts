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
  } catch (error) {
    res.status(404).json({ massage: 'error.' })
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
        res.status(404).json({ massage: "couldnt find user by this id" })
      }
      res.send(object)
    } else {
      res.status(404).json({ massgae: 'wrong format.' })
    }
  } catch (error) {
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
        res.send(updateUser)
      } catch (err) {
        throw new Error('invalid email')
      }
    } else {
      res.send('email or user name is wrong format')
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
    if (!test.error) {
      const deleteUser = await prisma.user.delete({
        where: {
          id: parseInt(req.params.id),
        }
      })
      res.send(deleteUser)
    } else {
      res.status(404).json({ massgae: 'wrong format.' })
    }
  } catch (err) {
    res.status(404).json({ massage: 'Cannot delete by this id' })
  }
})

userRoute.post('/', async (req: Request, res: Response) => { //create user gg
  try {
    const schema = Joi.object({
      name: Joi.string().max(30).required(),
      email: Joi.string().email().required(),
    })
    var test = schema.validate({ name: req.body.name, email: req.body.email, title: req.body.title })
    if (!test.error) {
      const user = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
        },
      })
      res.send(user)
    } else {
      res.json({ massage: 'error na kub' })
    }
  } catch (error) {
    res.status(404).json({ massage: 'Cannot create this Post' })
  }
})

userRoute.put('/post/:user_id', async (req: Request, res: Response) => { //create post for specific user
  try {
    const data = req.params.user_id
    const schema = Joi.object({
      id: Joi.number().integer().required(),
      title: Joi.string().max(500).required()
    })
    const test = schema.validate({ id: data, title: req.body.title })
    if (!test.error) {
      const create_post = await prisma.user.update({
        where: {
          id: parseInt(data)
        },
        data: {
          posts: {
            create: {
              title: req.body.title
            }
          }
        }
      })
      res.send(create_post)
    } else {
      res.status(404).json({ massage: "cannot create post by following user id" })
    }
  } catch (error) {
    res.status(404).json({ massage: "Create post error" })
  }
})

userRoute.delete('/post/:post_id', async (req: Request, res: Response) => { //delete post from specific id
  try {
    const post_id = req.params.post_id
    const schema = Joi.object({
      postID: Joi.number().integer().required(),
    })
    const test = schema.validate({ postID: post_id })
    if (!test.error) {
      const deletePost = await prisma.post.delete({
        where: {
          id: parseInt(post_id)
        }
      })
      res.send(deletePost)
    }
  } catch (error) {
    res.status(404).json({ massage: "GG na krub" })
  }
})

userRoute.delete('/post/all/:author_id ', async (req: Request, res: Response) => { //delete all post from specific user
  try {
    const author_id = req.params.author_id
    const schema = Joi.object({
      authorID: Joi.number().integer().min(0).required(),
    })
    const test = schema.validate({ authorID: author_id })
    if (!test.error) {
      const deleteAllPost = await prisma.post.deleteMany({
        where: {
          authorId: parseInt(author_id)
        }
      })
      res.send(deleteAllPost)
    } else {
      res.status(404).json({ massage: "wrong format of author_id" })
    }
  } catch (error) {
    res.status(404).json({ massage: "cannot delete all Posts of specific author_id" })
  }
})

userRoute.put('/post/:post_id/edit/', async (req: Request, res: Response) => { //edit title of post from specific post_id
  try {
    const post_id = req.params.post_id
    const schema = Joi.object({
      postID: Joi.number().integer().min(0).required(),
    })
    const test = schema.validate({ postID: post_id })
    if (!test.error) {
      const editTitle = await prisma.post.update({
        where: {
          id: parseInt(post_id)
        },
        data: {
          title: req.body.title
        }
      })
      res.send(editTitle)
    } else {
      res.status(404).json({ massage: "wrong format from post_id" })
    }
  } catch (error) {
    res.status(404).json({ massage: "cannot edit post from specific post_id" })
  }
})

export default userRoute