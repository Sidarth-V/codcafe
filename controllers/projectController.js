const Users = require('../models/profileModel')
const Project = require('../models/projectModel')
const fs = require('fs');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const path = require('path')

const createProject = async(req, res) => {
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
}

const viewProject = async (req, res) => {
  const user = await Users.findOne({ email: req.user.email })
  const project = await Project.findOneAndUpdate({_id: req.query.id }, {$inc : {'viewCount' : 1}})

  const authorImg = await Users.findOne({ _id: project.postedBy }, { userImg: 1})

  if(!project.postedBy.equals(user._id)){
    if(!project.contributorIds.includes(user._id)) {
      res.render('pages/project', {project, contrib: true, authorImg})
    }
    else {
      res.render('pages/project', {project, contrib: false, authorImg})
    }
  } else {
    res.render('pages/project', {project, contrib: false, authorImg})
  }
}

const contribute = async (req, res) => {
  const user = await Users.findOne({ email: req.user.email })
  const project =  await Project.findOneAndUpdate({_id: req.query.id }, {$push:{"contributorIds": user._id}})
  res.redirect('/explore')
}

const topViews = async ( req, res) => {
  const token = req.cookies.token
  let status = "logout"
  if (token === undefined) {
      status = "login"
  }
  const projects = await Project.find({ inProgress: true }).sort({ viewCount: -1}).limit(5)
  for (let project of projects) {
    project.authorImg = await Users.findOne({ _id: project.postedBy}, { userImg: 1})
  }
  const users = await Users.find().sort({viewCount: -1}).limit(8)
  res.render('pages/index', {projects, users, status})
}

module.exports = { createProject, viewProject, contribute, topViews}