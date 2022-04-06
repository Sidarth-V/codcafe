const User = require('../models/profileModel')
const response = require('../config/responseSchema')

const createUser = async (req, res) => {
  try {
    const currentUser = User.findOne({ email: req.user.email })
    if (!currentUser) throw new Error('Cannot find user')
  } catch (err) {
    response(res, {}, err.message, false, 400)
  }
}

module.exports = createUser
