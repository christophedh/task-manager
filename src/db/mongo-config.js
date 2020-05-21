const mongodb = require('mongodb')
// const ObjectID = mongodb.ObjectID
// const MongoClient = mongodb.MongoClient
const { ObjectID, MongoClient } = mongodb
const uri = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'
const id = new ObjectID()
// console.log(id.id)
// console.log(id.toHexString().length)

const client = MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

module.exports = { client, database, ObjectID }
