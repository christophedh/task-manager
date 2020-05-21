const { mongoose } = require('../db/mongoose-connect')
// const validator = require('validator')
const Schema = mongoose.Schema

const TaskSchema = new Schema(
    {
        description: { type: String, trim: true, required: true },
        completed: { type: Boolean, default: false },
        owner: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    { timestamps: true }
)

TaskSchema.pre('save', function() {
    // const task = this
    // console.log(task)
})
const Task = mongoose.model('Task', TaskSchema)

module.exports = { Task }
