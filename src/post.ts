import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import * as Joi from 'joi'

const prisma = new PrismaClient()

const postRoute = express.Router()

postRoute.get('/', async (req: Request, res: Response) => {
    try {
        const seeAll = await prisma.post.findMany()
        res.send(seeAll)
    } catch (error) {
        res.status(404).json({ massage: "error" })
    }
})

postRoute.post('/title', async (req: Request, res: Response) => {
    try {
        const title = req.body.title
        const schema = Joi.object({
            title: Joi.string().required(),
        })
        var test = schema.validate({ title: title })
        if (!test.error) {
            console.log("test1")
            const post = await prisma.post.findMany({
                where: {
                    title: {
                        contains: title
                    }
                },
            })
            console.log("test1")
            console.log(title)
            res.json({ data: post })
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({ massage: 'error.', error })
    }
})

postRoute.post('/authorID', async (req: Request, res: Response) => {
    try {
        const authorID = req.body.authorID
        const schema = Joi.object({
            authorID: Joi.number().integer().required(),
        })
        var test = schema.validate({ authorID: authorID })
        if (!test.error) {
            console.log("test1")
            const post = await prisma.post.findMany({
                where: {
                    authorId: authorID
                },
            })
            console.log("test1")
            console.log(post)
            res.json({ data: post })
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({ massage: 'error.', error })
    }
})

postRoute.get('/:post_id', async (req: Request, res: Response) => {
    try {
        const post_id = req.params.post_id
        const schema = Joi.object({
            postID: Joi.number().integer().min(0).required(),
        })
        const test = schema.validate({ postID: post_id })
        if (!test.error) {
            const object = await prisma.post.findUnique({
                where: {
                    id: parseInt(post_id)
                }
            })
            res.json({ data: object })
        } else {
            res.status(404).json({ massage: "wrong format of post_id" })
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({ massage: "cannot get post object" })
    }
})

postRoute.post('/:user_id', async (req: Request, res: Response) => { // create post from specific user
    try {
        const user_id = req.params.user_id
        const schema = Joi.object({
            userID: Joi.number().integer().min(0).required(),
        })
        const test = schema.validate({ userID: user_id })
        if (!test.error) {
            const createPost = await prisma.post.create({
                data: {
                    title: req.body.title,
                    authorId: parseInt(req.params.user_id),
                    published: false
                }
            })
            res.json({ data: createPost })
        } else {
            res.status(404).json({ massage: "wrong format for user_id" })
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({ massage: "cannnot create post" })
    }
})

postRoute.delete('/all/:author_id?', async (req: Request, res: Response) => { //delete all post from specific user
    try {
        console.log('sdf')
        const author_id = req.params.author_id
        const schema = Joi.object({
            authorID: Joi.number().integer().min(0).required(),
        })
        const test = schema.validate({ authorID: author_id })
        console.log("test")
        if (!test.error) {
            const deleteAllPost = await prisma.post.deleteMany({
                where: {
                    authorId: parseInt(author_id)
                }
            })
            res.json({ data: deleteAllPost })
        } else {
            res.status(404).json({ massage: "wrong format of author_id" })
        }
    } catch (error) {
        console.log('test_debug_state 3')
        console.log(error)
        res.status(404).json({ massage: "cannot delete all Posts of specific author_id" })
    }
})

postRoute.delete('/:post_id?', async (req: Request, res: Response) => { //delete post from specific id
    try {
        console.log("test1")
        if (!req.params.post_id) {
            res.status(404).json({ massage: "error from url" })
            return
        }
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
            res.json({ data: deletePost })
        }
    } catch (error) {
        res.status(404).json({ massage: "GG na krub" })
    }
})

postRoute.put('/:post_id', async (req: Request, res: Response) => { //edit title of post from specific post_id
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
            res.json({ data: editTitle })
        } else {
            res.status(404).json({ massage: "wrong format from post_id" })
        }
    } catch (error) {
        console.log(error)
        res.status(404).json({ massage: "cannot edit post from specific post_id" })
    }
})

export default postRoute