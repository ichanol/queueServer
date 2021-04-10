const express = require('express')
const {
  postQueue,
  getServiceLocation,
  deleteQueue,
  getQueue,
  getTimer,
  postTimer,
} = require('../controllers')
const { isAuthorize } = require('../middlewares')

const router = express.Router()

router.use((req, res, next) => {
  console.log(`@${new Date().toISOString()} => ${req.originalUrl}`)
  next()
})

router.route('/service').get(getServiceLocation)

router.use(isAuthorize)

router.route('/timer').get(getTimer).post(postTimer)

router
  .route('/queue/:serviceLocation?')
  .get(getQueue)
  .post(postQueue)
  .delete(deleteQueue)

module.exports = router
