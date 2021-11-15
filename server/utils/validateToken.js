const jwt = require('jsonwebtoken')

// Validate Token
const validateToken = (req, res, next) => {
//get token from request header
const authHeader = req.headers["authorization"]
const token = authHeader.split(" ")[1]
//the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
if (token == null) res.sendStatus(400).send("Token not present")
jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
if (err) { 
 res.status(403).send("Token invalid")
 }
 else {
 req.user = user
 next() 
 }
}) 
} 
module.exports = validateToken;