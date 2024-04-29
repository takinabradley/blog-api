/* std imports */
const path = require('path')
const fs = require('fs')
/* local imports */
const routes = require('./routes')
const User = require('./models').User
/* package imports */
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const debug = require('debug')
const cors = require('cors')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')
const RateLimitMongoStore = require('rate-limit-mongo')

// debug configuration
const appDebugger = debug('blog-api:app')

// mongoose configuration
mongoose
  .connect(process.env.MONGO_DEV_URL || process.env.MONGO_PROD_URL || '')
  .then((_) => appDebugger('successfully connected'))
  .catch((_) => appDebugger('failed to connect'))

// passport configuration
/*
const passportJWTOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY || secret phrase,
  issuer: 'enter issuer here',
  audience: 'enter audience here',
  algorithms: ['RS256'],
  ignoreExpiration: false,
  passReqToCallback: false,
  jsonWebTokenOtions: {
    complete: false,
    clockTolerence: '',
    maxAge: '2d',
    clockTimestamp: '100;,
    nonce: 'string here for Openid',
  }
}
*/
const publicKey = fs.readFileSync(path.join(__dirname, 'id_rsa_pub.pem'), {
  encoding: 'utf8'
})

const passportJWTOptions = {
  // Authorization: Bearer <token>
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: publicKey,
  algorithms: ['RS256']
}

passport.use(
  new JwtStrategy(passportJWTOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findOne({ _id: jwtPayload.sub })
      if (user) {
        // no error, and a user was found
        done(null, user)
      } else {
        // no error, and a user wansn't found
        done(null, false)
      }
    } catch (e) {
      // some kind of error occurred
      done(e, false)
    }
  })
)

// express app
const app = express()
app.use(logger('dev'))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', routes.api)

module.exports = app
