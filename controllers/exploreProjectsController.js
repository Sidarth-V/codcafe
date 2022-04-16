const Users = require('../models/profileModel')
const Project = require('../models/projectModel')

const exploreProjects = async (req, res) => {
  const projects = await Project.find({ finished: false})
  let data = []

  for (let project of projects) {
    project.authorImg = await Users.findOne({ _id: project.postedBy}, { userImg: 1})
    data.push(project)
  }
    
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
}

module.exports = { exploreProjects }