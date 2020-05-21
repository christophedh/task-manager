const { mongoose } = require('../db/mongoose-connect')
const { Schema } = mongoose
const { Task } = require('../models/task')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid')
                }
            }
        },
        password: {
            type: String,
            trim: true,
            required: true,
            validate(value) {
                if (validator.isLength(value, { max: 6 })) {
                    throw new Error('password must be at least 6 characthers')
                }

                if (value.includes('password')) {
                    throw new Error(
                        'this password is insecure do not use "password" as password'
                    )
                }
            }
        },
        age: {
            type: Number,
            required: true,
            default: 32,
            validate(value) {
                if (value <= 0) {
                    throw Error('age must be a positive number')
                }
            }
        },
        isRoot: {
            type: Boolean,
            required: true,
            default: false
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ],
        avatar: {
            type: Buffer
        }
    },
    { timestamps: true }
)

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('unable to login')
    }

    const isLogged = await bcrypt.compare(password, user.password)

    if (!isLogged) {
        throw new Error('unable to login')
    }

    return user
}

userSchema.methods.toJSON = function() {
    const user = this
    const { password, tokens, avatar, ...publicParameters } = user.toObject()

    return publicParameters
}

userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisissecret')

    user.tokens.push({ token })
    await user.save()

    return token
}

userSchema.pre('save', async function(next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
