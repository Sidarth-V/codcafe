const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failed',
    session: false
  }),
  function (req, res) {
    res.redirect(
      `${process.env.FRONTEND_URL}/gallery.html`
    )
  }
)

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/failed' }),
  function (req, res) {
    res.redirect(
      `${process.env.FRONTEND_URL}/successfulGithubAuth?token=${req.user.jwt}?isNew=${req.user.isNew}`
    )
  }
)

module.exports = router
