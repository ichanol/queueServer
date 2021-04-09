const express = require('express')
const {
  postQueue,
  getServiceLocation,
  deleteQueue,
  getQueue,
} = require('../controllers')
const { isAuthorize } = require('../middlewares')
const router = express.Router()

const timer = {}
const defaultTimeout = 45 * 60 * 1000

const setTimer = (id, duration) => {
  clearTimeout(timer[id])
  timer[id] = setTimeout(() => {
    console.log(id, ' timeout', duration)
    delete timer[id]
  }, duration * 1000)
  timer[id].created = new Date().getTime()
}

router.use((req, res, next) => {
  console.log(`@${new Date().toISOString()} => ${req.originalUrl}`)
  next()
})

router
  .route('/timer')
  .get(async (req, res) => {
    const id = req.body.id
    const duration = req.body.duration

    res.json({
      created: timer[id].created,
      timeleft: duration - (new Date().getTime() - timer[id].created) / 1000,
    })
  })
  .post(async (req, res) => {
    const id = req.body.id
    const duration = req.body.duration
    setTimer(id, duration)
    res.json({ success: true })
  })
  .delete(async (req, res) => {
    const id = req.body.id
    clearTimeout(timer[id])
    delete timer[id]
    res.json({ success: true })
  })

router.route('/service').get(getServiceLocation)

router.use(isAuthorize)

router
  .route('/queue/:serviceLocation?')
  .post(postQueue)
  .delete(deleteQueue)
  .get(getQueue)

module.exports = router
