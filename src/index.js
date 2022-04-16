require('dotenv').config()
require('../config/passport')

const cors = require('cors')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const multer = require('multer')

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });


const app = express()
const DB_URL = process.env.DB_URI
const PORT = process.env.PORT || 3000

const authorised = require('../middleware/authorised')
const authRoutes = require('../routes/auth')
const Project = require('../models/projectModel')
const Users = require('../models/profileModel')

const userController = require('../controllers/userController')
const exploreProjectsController = require('../controllers/exploreProjectsController')
const projectController = require('../controllers/projectController')
const exploreUsersController = require('../controllers/exploreUsersController')
const newsController = require('../controllers/newsController')

// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.urlencoded({
  extended: true
}));

// Establishing connection to mongoDB
mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Database Connected!')
  })
  .catch((err) => {
    console.log('DB connect error:', err)
  })

// Index Page
app.get('/',projectController.topViews)

// Authentication
app.use('/auth', authRoutes)
app.get('/login', (req, res) => {
  res.render('pages/login')
})
app.get('/logout', function(req, res){
  res.clearCookie('token');
  res.redirect('/');
});


// User Routes
app.get('/createUser', userController.createLocalUserPage)
app.post('/addUser', upload.single('image'), userController.createLocalUserCallback)

app.get('/updateUser',  authorised, userController.createAuthUserPage)
app.post('/updateUser',  authorised, upload.single('image'), userController.createAuthUserCallback)

app.get('/profile', authorised, userController.profile)
app.get('/social', authorised, exploreUsersController.exploreUsers)

// Projects Routes
app.get('/create', authorised, (req, res) => {
  res.render('pages/create')
})
app.post('/createProject', authorised, upload.single('image'), projectController.createProject)
app.get('/explore', authorised, exploreProjectsController.exploreProjects)
app.get('/project', authorised, projectController.viewProject)
app.get('/contribute', authorised, projectController.contribute)

// Boring Routes
app.get('/contact', authorised, (req, res) => {
  res.render('pages/contact')
})

app.get('/news', authorised, newsController.getNews)

app.get('/faq', authorised, (req, res) => {
  res.render('pages/faq')
})

app.listen(PORT, () => {
  console.log('🚀 Server Ready! at port:', PORT)
  console.log('Goto http://localhost:' + PORT)
})
