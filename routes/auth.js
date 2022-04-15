const express = require('express')
const router = express.Router()
const passport = require('passport')
const Users = require('../models/profileModel')
const jwt = require('jsonwebtoken')

router.post('/localLogin', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    token = jwt.sign(
      { email: req.user.email },
      process.env.TOKEN_SECRET
    )
    res.cookie('token', token)
    res.redirect('/profile');
  }
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failed',
    session: false
  }),
  async function (req, res) {
    res.cookie('token', req.user.jwt)
    let user = await Users.findOne({ email: req.user._json.email })
    if(user.done == true){
      res.redirect('/profile')
    } else {
      res.redirect('/createUser')
    }
  }
)

router.get(
  '/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/failed' }),
  function (req, res) {
    res.redirect('/user')
  }
)

module.exports = router
