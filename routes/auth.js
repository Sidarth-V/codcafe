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
    res.cookie('first', true)
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
    let user = await Users.findOne({ email: req.user._json.email })
    res.cookie('token', req.user.jwt)
    res.cookie('first', true)
    if(user){
      if(user.done){
        res.redirect('/profile')
      }
      else {
        res.redirect('/updateUser')
      }
    } else {
      res.redirect('/updateUser')
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
  async function (req, res) {
    let user = await Users.findOne({ email: req.user._json.email })
    res.cookie('token', req.user.jwt)
    res.cookie('first', true)
    if(user){
      if(user.done){
        res.redirect('/profile')
      }
      else {
        res.redirect('/updateUser')
      }
    } else {
      res.redirect('/updateUser')
    }
  }
)

module.exports = router
