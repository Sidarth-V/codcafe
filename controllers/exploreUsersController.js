const Users = require('../models/profileModel')

const exploreUsers = async (req, res) => {
  const users = await Users.find({})
  res.render('pages/social', {status: "logout", users})
}

module.exports = { exploreUsers }