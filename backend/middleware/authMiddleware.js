const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token
      token = req.headers.authorization.split(' ')[1]
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // Get user from token by id, omit the password
      req.user = await User.findById(decoded.id).select('-password')
      next()

    } catch (error) {
      console.log(error)
      res.status(401)  // Unauthorized
      throw new Error('Not Authorized')
    }
  }

  // Handle the case where no Bearer token is passed in
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = protect