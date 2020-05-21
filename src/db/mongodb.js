const { ObjectID, database, client } = require('./mongo-config')

client.connect(err => {
    if (err) {
        return console.log(err)
    }

    const db = client.db(database)
    // db.collection('users').insertOne(
    //     {
    //         _id: id,
    //         name: 'chris',
    //         age: 32
    //     },
    //     (err, result) => {
    //         if (err) {
    //             return console.log(
    //                 `someting went wrong unable to insert a user`
    //             )
    //         }

    //         console.log(result.ops)
    //         client.close()
    //     }
    // )
    // client.close()
    // db.collection('users').insertMany(
    //     [{ name: 'toto' }, { name: 'test' }, { name: 'tata' }],
    //     (err, result) => {
    //         if (err) {
    //             return console.log(err)
    //         }
    //         console.log(result.ops)
    //         client.close()
    //     }
    // )
    // db.collection('documents').insertMany(
    //     [
    //         { description: 'this is a document', completed: true },
    //         { description: 'this is new doc doc', completed: false }
    //     ],
    //     (err, result) => {
    //         if (err) {
    //             return console.log(err)
    //         }

    //         console.log(result.ops)

    //         client.close()
    //     }
    // )
    // db.collection('users').findOne(
    //     { _id: new ObjectID('5e5834d0b52db23de8bde2b5') },
    //     (err, user) => {
    //         if (err) {
    //             return console.log(err)
    //         }

    //         console.log(user)
    //         client.close()
    //     }
    // )
    // db.collection('users')
    //     .find({ age: 32 })
    //     .toArray((err, users) => {
    //         console.log(users)
    //         client.close()
    //     })

    // db.collection('users')
    //     .find({ age: 32 })
    //     .count((err, count) => {
    //         console.log(count)
    //         client.close()
    //     })
    // db.collection('tasks').insertMany(
    //     [
    //         { description: 'a task1', completed: false },
    //         { description: 'a task2', completed: true },
    //         { description: 'a task3', completed: false }
    //     ],
    //     (err, resp) => {
    //         console.log(resp.ops)
    //         client.close()
    //     }
    // )

    // db.collection('tasks').findOne(
    //     { _id: ObjectID('5e58457ed5fe08560f6e1fd1') },
    //     (err, task) => {
    //         console.log(task)
    //         client.close()
    //     }
    // )

    // db.collection('tasks')
    //     .find({ completed: false })
    //     .toArray((err, tasks) => {
    //         console.log(tasks)
    //         client.close()
    //     })

    // db.collection('users')
    //     .updateOne(
    //         {
    //             _id: new ObjectID('5e5834d0b52db23de8bde2b4')
    //         },
    //         {
    //             $inc: {
    //                 age: 1
    //             }
    //             // $set: {
    //             //     name: 'toto has been updated'
    //             // }
    //         }
    //     )
    //     .then(res => console.log(res.modifiedCount))
    //     .catch(err => console.log(err))
    // db.collection('tasks')
    //     .updateMany({ completed: false }, { $set: { completed: true } })
    //     .then(res => console.log(res.modifiedCount))
    //     .catch(err => console.log(err))
    // db.collection('users')
    //     .deleteOne({
    //         _id: ObjectID('5e5834d0b52db23de8bde2b6')
    //     })
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err))
    db.collection('tasks')
        .deleteMany({ completed: true })
        .then(res => console.log(res.deletedCount))
        .catch(err => console.log(err))
})
