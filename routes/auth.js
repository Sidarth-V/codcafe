const express = require('express')
const router = express.Router()
const passport = require('passport')

let dev = false
let hire = false

const isDev = (req, res, next) => {
  dev = true
  fire = false
  next()
}

const isHire = (req, res, next) => {
  dev = false
  hire = true
  next()
}

router.get(
  '/dev/google', isDev,
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failed',
    session: false
  }),
  function (req, res) {
    res.cookie('token', req.user.jwt)
    if(dev) {
      res.redirect('/profile')
    } else if(hire) {
      res.redirect('/collection')
    }
    
  }
)

router.get(
  '/hire/google', isHire, 
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/dev/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/failed' }),
  function (req, res) {
    res.redirect('/user')
  }
)

router.get(
  '/hire/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

module.exports = router
