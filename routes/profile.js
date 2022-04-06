const express = require('express')
const router = express.Router()
const response = require('../config/responseSchema')
const profileController = require('../controllers/profileController')

router.get('/createProfile', profileController)

router.get('/profile', function (req, res) {
  response(res, req.user)
})

module.exports = router
