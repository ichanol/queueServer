const express = require('express')
const { postQueue, getServiceLocation } = require('../controllers')
const { isAuthorize } = require('../middlewares')
const router = express.Router()

router.use((req, res, next) => {
  console.log(`@${new Date().toISOString()} => ${req.originalUrl}`)
  next()
})

router.route('/service').get(getServiceLocation)

router.use(isAuthorize)

router.route('/queue').post(postQueue)

module.exports = router
