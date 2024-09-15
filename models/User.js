const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  username: String,
  hash: String,
  publisher: Boolean
})

const User = model('User', UserSchema)

module.exports = User
