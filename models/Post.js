const { Schema, model } = require('mongoose')

const PostSchema = new Schema({
  title: String,
  text: String,
  published: Boolean,
  date: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

const Post = model('Post', PostSchema)

module.exports = Post
