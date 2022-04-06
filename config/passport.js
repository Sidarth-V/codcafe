const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const passport = require('passport')
const User = require('../models/profileModel')
const jwt = require('jsonwebtoken')

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_SECRET
    },
    async function (jwtPayload, done) {
      try {
        console.log(jwtPayload)
        const user = await User.findOne({ email: jwtPayload.email })
        return done(null, user)
      } catch (error) {
        return done(null, false, {
          message: 'invalid e-mail address or password'
        })
      }
    }
  )
)

const checkIfUserExists = async (profile, cb) => {
  const currentUser = await User.findOne({ email: profile._json.email })
  if (currentUser) {
    profile.jwt = jwt.sign(
      { email: profile._json.email },
      process.env.TOKEN_SECRET
    )
    profile.isNew = false
  } else {
    const newUser = new User({
      email: profile._json.email,
      name: profile._json.name
    })
    newUser.save()
    profile.jwt = jwt.sign(
      { email: profile._json.email },
      process.env.TOKEN_SECRET
    )
    profile.isNew = true
  }
  return cb(null, profile)
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile)
      checkIfUserExists(profile, cb)
    }
  )
)

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback'
    },
    function (accessToken, refreshToken, profile, done) {
      checkIfUserExists(profile, done)
    }
  )
)
