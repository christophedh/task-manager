const { UserRouter } = require('./src/routers/user')
const { TaskRouter } = require('./src/routers/task')
// const multer = require('multer')
const cors = require('cors')

const express = require('express')
const port = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port, 'localhost', () => {
    console.log(`server running ${port}`)
})
