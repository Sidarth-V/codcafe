const Users = require('../models/profileModel')
const Project = require('../models/projectModel')
const fs = require('fs');
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

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

  if(!project.postedBy.equals(user._id)){
    if(!project.contributorIds.includes(user._id)) {
      res.render('pages/project', {project, contrib: true})
    }
    else {
      res.render('pages/project', {project, contrib: false})
    }
  } else {
    res.render('pages/project', {project, contrib: false})
  }
}

const contribute = async (req, res) => {
  const user = await Users.findOne({ email: req.user.email })
  const project =  await Project.findOneAndUpdate({_id: req.query.id }, {$push:{"contributorIds": user._id}})
  res.redirect('/explore')
}

module.exports = { createProject, viewProject, contribute}