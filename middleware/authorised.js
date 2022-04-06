const passport = require('passport')
const response = require('../config/responseSchema')

const authorized = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (error, user) => {
    if (error || !user) {
      response(res, {}, 'Please authenticate yourself', false, 401)
      return
    }
    req.user = user
    next()
  })(req, res, next)
}

module.exports = authorized
