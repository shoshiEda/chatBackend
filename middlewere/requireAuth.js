const jwt = require('jsonwebtoken');
const secret = process.env.SECRET1 || 'Secret';

const authenticateToken = (req, res, next) => {
    

    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]

    
    if (!token) return res.status(401).send({ error: "Access denied. No token provided." })

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).send({ error: "Invalid token." })

        req.user = user
        next()
    })
}

module.exports = authenticateToken