const mongoose = require('mongoose')

const profileSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  }
})

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile
