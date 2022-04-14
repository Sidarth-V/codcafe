require('dotenv').config()
require('../config/passport')


const cors = require('cors')
const path = require('path')
const fs = require('fs');
const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const multer = require('multer')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)


var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({ storage: storage });


const app = express()
const DB_URL = process.env.DB_URI
const PORT = process.env.PORT || 3000

const authorised = require('../middleware/authorised')
const authRoutes = require('../routes/auth')
const profileRoutes = require('../routes/profile')
const Project = require('../models/projectModel')

// set the view engine to ejs
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Database Connected!')
  })
  .catch((err) => {
    console.log('DB connect error:', err)
  })

app.get('/', (req, res) => {
  res.render('pages/index', {success: false})
})

app.post('/', (req, res) => {
  console.log(req.body)
  res.render('pages/index', {success: true})
})

app.get('/login', (req, res) => {
  res.render('pages/login')
})

app.get('/profile', authorised, (req, res) => {
  res.render('pages/profile', {name: req.user.name, email: req.user.email, skills: "App Development, Web Development"})
})

app.get('/collection', authorised, (req, res) => {
  res.render('pages/collection', {name: req.user.name, email: req.user.email, skills: "App Development, Web Development"})
})

app.get('/explore', authorised, async (req, res) => {
  const projects = await Project.find({ finished: false})
  data = projects
  let result = [];
  if(req.query.array) {
    if(req.query.array.length > 0){
      result = [];
      var arr = JSON.parse(req.query.array);
      data.forEach(element => {
        element.techUsed.forEach(tech => {
          if(arr.includes(tech)){
            if(!result.includes(element)) result.push(element)
          }
        })
      });
    } 
  } 
  if(result.length == 0) result = data;
  
  res.render('pages/explore', {data: result})
})

app.get('/contact', authorised, (req, res) => {
  res.render('pages/contact')
})

app.get('/news', authorised, (req, res) => {
  res.render('pages/news')
})

app.get('/author', authorised, (req, res) => {
})

app.get('/create', authorised, (req, res) => {
  res.render('pages/create')
})

app.get('/faq', authorised, (req, res) => {
  res.render('pages/faq')
})

app.get('/logout', function(req, res){
  res.clearCookie('token');
  res.redirect('/');
});

app.post('/createProject', authorised, upload.single('image'), async(req, res) => {
  let newProject = new Project(
    {
      name: req.body.proj_title,
      desc: req.body.proj_desc,
      techUsed: req.body.techUsed,
      maxContributors: req.body.maxContributors,
      postedBy: req.user.id,
      inProgress: true,
      finished: false,
      projectImg: {
        data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
        contentType: 'image/png'
      },
      posterName: req.user.name
    }
  )
  newProject.save()
  await unlinkAsync(path.join(__dirname + '/../uploads/' + req.file.filename))
  res.redirect('/explore')
})

app.get('/project', authorised, async(req, res) =>{
  const project = await Project.findOneAndUpdate({_id: req.query.id }, {$inc : {'viewCount' : 1}})
  console.log(project.name)
  res.render('pages/project')
})

app.use('/auth', authRoutes)

app.listen(PORT, () => {
  console.log('🚀 Server Ready! at port:', PORT)
  console.log('Goto http://localhost:' + PORT)
})
