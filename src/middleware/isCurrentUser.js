const isCurrentUser = (req, res, next) => {
    const {
        user,
        params: { id }
    } = req
    const { _id } = user
    try {
        if (_id.toString() !== id) {
            throw new Error('Access denied')
        }

        next()
    } catch (e) {
        res.status(401).send(String(e))
    }
}

module.exports = isCurrentUser
