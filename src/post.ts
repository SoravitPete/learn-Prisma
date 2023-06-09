import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response } from 'express'
import * as Joi from 'joi'

const prisma = new PrismaClient()

const postRoute = express.Router()

postRoute.get('/' , async (req: Request, res: Response) => {
    try {
        const seeAll = await prisma.post.findMany()
        res.send(seeAll)
    } catch (error) {
        res.status(404).json({massage : "error"})
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
            res.send(object)
        } else {
            res.status(404).json({ massage : "wrong format of post_id"})
        }
    } catch (error) {
        res.status(404).json({ massage : "cannot get post object"})
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
            res.send(createPost)
        } else {
            res.status(404).json({ massage : "wrong format for user_id"})
        }
    } catch (error) {
        res.status(404).json({ massage: "cannnot create post"})
    }
})

postRoute.delete('/all/:author_id', async (req: Request, res: Response) => { //delete all post from specific user
    try {
        console.log('sdf')
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
        console.log('sdf')
        res.status(404).json({ massage: "cannot delete all Posts of specific author_id" })
    }
})

postRoute.delete('/:post_id', async (req: Request, res: Response) => { //delete post from specific id
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

postRoute.put('/:post_id/edit/', async (req: Request, res: Response) => { //edit title of post from specific post_id
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

export default postRoute