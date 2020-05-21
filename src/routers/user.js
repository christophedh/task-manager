const User = require('../models/user')
const express = require('express')
const auth = require('../middleware/auth')
const isRoot = require('../middleware/isRoot')
const multer = require('multer')
const sharp = require('sharp')

// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')

const UserRouter = new express.Router()

UserRouter.get('/users/me', auth, async (req, res) => {
    await req.user.populate('tasks').execPopulate()
    res.send(req.user)
})

UserRouter.get('/users', [auth, isRoot], async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(String(e))
    }
})

UserRouter.get('/users/:id', [auth, isRoot], async (req, res) => {
    try {
        const { id: _id } = req.params
        const user = await User.findById(_id)

        if (!user) {
            res.status(404).send('user not found')
        }

        res.send(user)
    } catch (e) {
        res.status(404).send(String(e))
    }
})

UserRouter.post('/users/logoutAll', auth, async (req, res) => {
    try {
        const { user } = req
        user.tokens = []

        await user.save()

        res.send()
    } catch (e) {
        res.status(500).send(String(e))
    }
})

UserRouter.post('/users/logout', auth, async (req, res) => {
    try {
        const { user, token: currentToken } = req
        user.tokens = user.tokens.filter(token => token.token !== currentToken)
        await user.save()
        res.send()
    } catch (e) {
        res.status(500).send(String(e))
    }
})

UserRouter.post('/users', async (req, res) => {
    try {
        const user = await User({ ...req.body }).save()

        if (!user) {
            res.status(404).send('user not found')
        }

        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(String(e))
    }
})

UserRouter.patch('/users/me', auth, async (req, res) => {
    // const { id: _id } = req.params
    const { user } = req
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age', 'isRoot']
    const isValidOperation = updates.every(update => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send('invalid updates parameters')
    }

    try {
        updates.forEach(update => (user[update] = req.body[update]))

        await user.save()

        res.send(user)
    } catch (e) {
        res.status(400).send(String(e))
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
            callback(new Error('File must be an image'))
        }
        callback(undefined, true)
    }
})

UserRouter.post(
    '/users/me/avatar',
    auth,
    upload.single('avatar'),
    async (req, res) => {
        const { user, file } = req
        const buffer = await sharp(file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer()
        user.avatar = buffer
        await user.save()
        res.send()
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message })
    }
)

UserRouter.delete(
    '/users/me/avatar',
    auth,
    async (req, res) => {
        const { user } = req
        user.avatar = undefined
        await user.save()
        res.send()
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message })
    }
)

const uploadJpg = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
            callback(new Error('error you must provide a jpg,jpeg or png file'))
        }

        callback(undefined, true)
    }
})

UserRouter.post('/users/me/jpg', uploadJpg.single('avatar'), (req, res) => {
    res.send()
})

UserRouter.delete('/users/me', auth, async (req, res) => {
    try {
        const { user } = req
        await user.remove()
        res.send(user)
    } catch (e) {
        res.status(400).send(String(e))
    }
})

UserRouter.post('/users/login', async (req, res, next) => {
    const { email, password } = req.body
    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        // next(e)
        res.status(400).send(String(e))
    }
})

UserRouter.get('/users/:id/avatar', async (req, res) => {
    try {
        const { id: _id } = req.params
        const user = await User.findById(_id)
        if (!user || !user.avatar) {
            throw new Error('user or avatar not found')
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

module.exports = { UserRouter }
