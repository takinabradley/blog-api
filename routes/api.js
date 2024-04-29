const { Router } = require('express')
const apiRouter = Router()

apiRouter.get('/', (req, res) => {
  res.json({ msg: 'welcome' })
})

module.exports = apiRouter
