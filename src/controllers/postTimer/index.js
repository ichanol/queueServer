const redis = require('redis')
const { promisify } = require('util')
const { setTimer } = require('../../helpers')
const { sendPushNotification, directMessage } = require('../../models')

const client = redis.createClient()
const HGET = promisify(client.hget).bind(client)
const LPOS = promisify(client.lpos).bind(client)

client.on('error', function (error) {
  console.error(error)
})

const postTimer = async (req, res) => {
  let totalNumber
  const response = {
    success: false,
    message: "Can't start a timer. Location not found.",
  }

  const { serviceLocation } = req.body

  if (serviceLocation) {
    totalNumber = await HGET('location', serviceLocation)
  }

  if (totalNumber) {
    let queueNumber
    const currentQueue = await LPOS(serviceLocation, req.fcmToken)

    if (currentQueue !== null) {
      queueNumber = currentQueue + 1
    }

    if (queueNumber <= totalNumber) {
      const sendNotificationToUser = async () => {
        await sendPushNotification(req.fcmToken, 'FINISH')
        directMessage(req.fcmToken, 'QUEUE_UP')
      }

      const startTime = setTimer(
        serviceLocation,
        req.fcmToken,
        20,
        sendNotificationToUser,
      )

      response.success = true
      response.queueStatus = 'ACTIVE'
      response.message = `You're using washing machine at ${serviceLocation}.`
      response.location = serviceLocation
      response.startTime = startTime
    } else {
      res.status(401)
      response.queueStatus = 'WAITING'
      response.message = `Easy. It's not your turn to use the washing machine at ${serviceLocation}. You are number ${queueNumber} in line.`
    }
    res.json(response)
    return
  }
  res.status(401).json(response)
}

module.exports = postTimer
