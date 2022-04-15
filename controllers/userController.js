const Users = require('../models/profileModel')
const Project = require('../models/projectModel')
const fs = require('fs');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const path = require('path')

const createUser = async (req, res) => {
  if(req.user){
    let user = await Users.findOne({ email: req.user.email})
    res.render('pages/createUser', {user, status:"logout", password: false})
  }
  res.render('pages/createUser', {user: "", status: "login", password: true})
}

const addUser = async (req, res) => {
  let isDev = false 
  let isHire = false
  if (req.body.role.includes("dev")) isDev = true
  if (req.body.role.includes("hire")) isHire = true
  if(req.user){
    let user = await Users.upsert({ email: req.user.email}, {
      name: req.body.fullName,
      email: req.body.email,
      skills: req.body.skills,
      userName: req.body.userName,
      userImg: {
        data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
        contentType: 'image/png'
      },
      isDev,
      isHire,
      done: true
    })
    user.save()
    await unlinkAsync(path.join(__dirname + '/../uploads/' + req.file.filename))
    res.redirect('/profile')
  } else {
    let user = new Users ({
      name: req.body.fullName,
      email: req.body.email,
      skills: req.body.skills,
      userName: req.body.userName,
      userImg: {
        data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
        contentType: 'image/png'
      },
      isDev,
      isHire,
      done: true,
      password: req.body.password
    })
    user.save()
    await unlinkAsync(path.join(__dirname + '/../uploads/' + req.file.filename))
    res.redirect('/login')
  }
  
  
}

const profile = async (req, res) => {
  let user = null
  let createdBy = null
  let inProgress = null
  let finished = null
  if(req.query.id) {
    user = await Users.findOneAndUpdate({_id: req.query.id }, {$inc : {'viewCount' : 1}})
    createdBy = await Project.find({ postedBy: req.query.id})
    inProgress = await Project.find({contributorIds: user._id, inProgress: true})
    finished = await Project.find({ contributorIds: user._id, finished: true})
  }
  else {
    user = await Users.findOne({ email: req.user.email })
    createdBy = await Project.find({ postedBy: user._id })
    inProgress = await Project.find({contributorIds: user._id, inProgress: true})
    finished = await Project.find({ contributorIds: user._id, finished: true})
  }
  res.render('pages/profile', { user, createdBy, inProgress, finished })
}

module.exports = { createUser, addUser, profile }