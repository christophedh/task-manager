const { Task } = require('../models/task')
const express = require('express')
const auth = require('../middleware/auth')

const TaskRouter = express.Router()

TaskRouter.get('/tasks/me', auth, async (req, res) => {
    try {
        const sort = {}
        const match = {}
        const { completed, limit, skip, sortBy } = req.query

        if (completed) {
            match.completed = completed === 'true' ? true : false
        }

        if (sortBy) {
            const [type, order] = sortBy.split(':')
            sort[type] = order === 'asc' ? 1 : -1
        }

        const { user } = req
        // const tasks = await Task.find({ owner: user._id })
        const { tasks } = await user
            .populate({
                path: 'tasks',
                match,
                options: {
                    limit: parseInt(limit),
                    skip: parseInt(skip),
                    sort
                }
            })
            .execPopulate()

        if (!tasks) {
            return res.statusCode(404).send('tasks not found')
        }

        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

TaskRouter.get('/tasks/:id', auth, async (req, res) => {
    try {
        const { id: _id } = req.params
        const { user } = req
        const task = await Task.findOne({ _id, owner: user._id })

        if (!task) {
            return res.status(404).send('task not found')
        }

        await task.populate('owner').execPopulate()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

TaskRouter.post('/tasks', auth, async (req, res) => {
    try {
        const { user } = req
        const task = await Task({ ...req.body, owner: user._id }).save()

        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

TaskRouter.patch('/tasks/:id', auth, async (req, res) => {
    try {
        const { id: _id } = req.params
        const { user } = req

        const allowedUpdates = ['completed', 'description']
        const updates = Object.keys(req.body)
        const isValidOperation = updates.every(update =>
            allowedUpdates.includes(update)
        )

        if (!isValidOperation) {
            return res.status(400).send('invalid updates parameters')
        }
        const task = await Task.findOne({ _id, owner: user._id })

        if (!task) {
            return res.status(404).send('task not found')
        }

        updates.forEach(update => (task[update] = req.body[update]))
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

TaskRouter.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const { id: _id } = req.params
        const { user } = req
        const task = await Task.findOne({ _id, owner: user._id })

        if (!task) {
            return res.status(404).send('task not found')
        }

        task.remove()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = { TaskRouter }
