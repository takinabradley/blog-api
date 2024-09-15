const { Router } = require('express')
const apiRouter = Router()
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Post = require('../models').Post
const Comment = require('../models').Comment
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const passport = require('passport')

const privateKey = fs.readFileSync(path.join(__dirname, '../', 'id_rsa_priv.pem'), {
  encoding: 'utf8'
})

apiRouter.post('/register', function (req, res, next) {
  bcrypt.hash(req.body.password, 8, function (err, hash) {
    if (err) return res.status(401).json({ success: false, msg: 'there was a problem creating the account' })

    try {
      User.create({
        username: req.body.username,
        hash
      })
        .then(user => {
          console.log('user created', user)
        })
    } catch (e) {
      return res.status(401).json({ success: false, msg: 'there was a problem creating the account' })
    }
  })

  return res.status(200).json({ success: true, msg: 'account created' })
})

apiRouter.post('/login',
  asyncErrorHandler(async function (req, res, next) {
    User.findOne({ username: req.body.username })
      .then(async user => {
        if (!user) {
          res.status(401).json({ success: false, msg: 'incorrect username or password' })
          return
        }

        if (req.body.password && await bcrypt.compare(req.body.password, user.hash)) {
        // if the password is valid, issue JWT
        /* const { token, expires } = utils.issueJWT(user) */
          const expires = '1d'
          const iat = Date.now()
          const token = jwt.sign({ sub: user._id, iat }, privateKey, { expiresIn: expires, algorithm: 'RS256' })
          res.status(200).json({
            success: true,
            user: { username: user.username, _id: user._id },
            token,
            tokenInfo: { expiresIn: '1d', iat: Date.now() }
          })
        } else {
          res.status(401).json({ success: false, msg: 'incorrect username or password' })
        }
      })
      .catch(next)
  }))

apiRouter.get(
  '/protected',
  (req, res, next) => {
    // if authorization fails, send back reason for failure
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {
      if (err || !user) {
        // 'unauthorized' is a fallback just in case `info.message` doesn't contain anything
        return res.status(401).json({ success: false, msg: info.message || 'unauthorized' })
      }
      next()
    })(req, res, next)
  },
  (req, res, next) => {
    return res.status(200).json({ success: true, msg: 'You are authorized' })
  }
)

apiRouter.post(
  '/protected/post/:postId/comment',
  (req, res, next) => {
    // if authorization fails, send back reason for failure
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {
      if (err || !user) {
        // 'unauthorized' is a fallback just in case `info.message` doesn't contain anything
        return res.status(401).json({ success: false, msg: info.message || 'unauthorized' })
      }
      next()
    })(req, res, next)
  },
  asyncErrorHandler(async (req, res, next) => {
    /*
      CREATE A COMMENT HERE
    */
    const post = await Post.findOne({ _id: req.params.postId })
    if (req.user && post && req.body.comment) {
      await Comment.create({ user: req.user, post, date: new Date(), text: req.body.comment })
    }

    return res.status(200).json({ success: true, msg: 'You are authorized' })
  })
)

apiRouter.get(
  '/posts',
  asyncErrorHandler(async (req, res, next) => {
    const posts = await Post.find({ published: true }).populate({ path: 'user', select: 'username -_id' })
    const comments = await Comment.find({ post: { $in: posts.map(post => post._id) } }).populate({ path: 'user', select: 'username -_id' })
    return res.status(200).json({
      success: true,
      posts,
      comments
    })
  })
)

apiRouter.get(
  '/protected/posts',
  (req, res, next) => {
    // if authorization fails, send back reason for failure
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {
      if (err || !user) {
        // 'unauthorized' is a fallback just in case `info.message` doesn't contain anything
        return res.status(401).json({ success: false, msg: info.message || 'unauthorized' })
      }
      next()
    })(req, res, next)
  },
  asyncErrorHandler(async (req, res, next) => {
    const posts = await Post.find().populate({ path: 'user', select: 'username -_id' })
    const comments = await Comment.find().populate({ path: 'user', select: 'username -_id' })
    return res.status(200).json({
      success: true,
      posts,
      comments
    })
  })
)

apiRouter.post(
  '/protected/posts/create',
  (req, res, next) => {
    // if authorization fails, send back reason for failure
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {
      if (err || !user) {
        // 'unauthorized' is a fallback just in case `info.message` doesn't contain anything
        return res.status(401).json({ success: false, msg: info.message || 'unauthorized' })
      }
      next()
    })(req, res, next)
  },
  asyncErrorHandler(async (req, res, next) => {
    const title = req.body.title
    const text = req.body.text
    const published = req.body.published
    const date = new Date()
    const userId = req.body.userId
    console.log(req.body)
    if (!userId) return res.status(401).json({ success: false, msg: 'bad userId' })
    if (!(title && text && published && date && userId)) return res.status(401).json({ success: false, msg: 'insufficient post data' })
    const user = await User.findOne({ _id: userId, publisher: true })
    if (!user) return res.status(401).json({ success: false, msg: 'bad userId' })

    await Post.create({ title, text, published, date: new Date(date), user })

    return res.status(200).json({
      success: true,
      msg: 'post created'
    })
  })
)

apiRouter.post(
  '/protected/posts/:postid/publish',
  (req, res, next) => {
    // if authorization fails, send back reason for failure
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {
      if (err || !user) {
        // 'unauthorized' is a fallback just in case `info.message` doesn't contain anything
        return res.status(401).json({ success: false, msg: info.message || 'unauthorized' })
      }
      next()
    })(req, res, next)
  },
  asyncErrorHandler(async (req, res, next) => {
    const postId = req.params.postid
    const post = await Post.updateOne({ _id: postId }, { $set: { published: true } })
    console.log(post)
    return res.status(200).json({
      success: true
    })
  })
)

apiRouter.post(
  '/protected/posts/:postid/unpublish',
  (req, res, next) => {
    // if authorization fails, send back reason for failure
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {
      if (err || !user) {
        // 'unauthorized' is a fallback just in case `info.message` doesn't contain anything
        return res.status(401).json({ success: false, msg: info.message || 'unauthorized' })
      }
      next()
    })(req, res, next)
  },
  asyncErrorHandler(async (req, res, next) => {
    const postId = req.params.postid
    const post = await Post.updateOne({ _id: postId }, { $set: { published: false } })
    console.log(post)
    return res.status(200).json({
      success: true
    })
  })
)

apiRouter.post(
  '/protected/comments/:commentid/delete',
  (req, res, next) => {
    // if authorization fails, send back reason for failure
    passport.authenticate('jwt', { session: false }, (err, user, info, status) => {
      if (err || !user) {
        // 'unauthorized' is a fallback just in case `info.message` doesn't contain anything
        return res.status(401).json({ success: false, msg: info.message || 'unauthorized' })
      }
      next()
    })(req, res, next)
  },
  asyncErrorHandler(async (req, res, next) => {
    const commentId = req.params.commentid
    await Comment.deleteOne({ _id: commentId })
    return res.status(200).json({
      success: true
    })
  })
)

module.exports = apiRouter
