const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  userName: {
    type: String
  },
  isDev: {
    type: Boolean
  },
  isHire: {
    type: Boolean
  },
  skills: [{
    type: String
  }],
  done: {
    type: Boolean
  },
  userImg: {
    data: Buffer,
    contentType: String
  },
  viewCount: {
    type: Number,
    default: 0
  },
  password: {
    type: String
  }
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile
