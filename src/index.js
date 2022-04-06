require('dotenv').config()
require('../config/passport')

const cors = require('cors')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')

const app = express()
const DB_URL = process.env.DB_URI
const PORT = process.env.PORT || 3000

const authorised = require('../middleware/authorised')
const authRoutes = require('../routes/auth')
const profileRoutes = require('../routes/profile')

// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '../public')))

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Database Connected!')
  })
  .catch((err) => {
    console.log('DB connect error:', err)
  })

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/login', (req, res) => {
  res.render('pages/login')
})

app.use('/auth', authRoutes)
app.use('/user', authorised, profileRoutes)

app.listen(PORT, () => {
  console.log('🚀 Server Ready! at port:', PORT)
  console.log('Goto http://localhost:' + PORT)
})
