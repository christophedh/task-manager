const isRoot = async (req, res, next) => {
    const { isRoot } = req.user

    // console.log(req.user)
    // console.log(isRoot)

    if (!isRoot) {
        res.status(401).send('Access denied')
    }

    next()
}

module.exports = isRoot
