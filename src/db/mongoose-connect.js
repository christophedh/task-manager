const mongoose = require('mongoose')
const uri = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'
const validator = require('validator')
mongoose.connect(`${uri}/${database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})


module.exports = { mongoose }
