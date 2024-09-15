const { Schema, model } = require('mongoose')

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  date: Date,
  text: String
})

const Comment = model('Comment', CommentSchema)

module.exports = Comment
