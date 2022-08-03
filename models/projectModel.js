const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
  name: {
    type: String
  },
  maxContributors: {
    type: Number
  },
  desc: {
    type: String
  },
  techUsed: [{
    type: String
  }],
  inProgress: {
    type: Boolean
  },
  finished: {
    type: Boolean
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId
  },
  contributorIds: [
    {
      type: mongoose.Schema.Types.ObjectId
    }
  ],
  viewCount: {
    type: Number,
    default: 0
  },
  projectImg: {
    data: Buffer,
    contentType: String
  },
  posterName: {
    type: String
  }
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
