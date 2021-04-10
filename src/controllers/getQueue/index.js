const redis = require('redis')
const { promisify } = require('util')
const { timers } = require('../../helpers')

const client = redis.createClient()
const HGET = promisify(client.hget).bind(client)
const LPOS = promisify(client.lpos).bind(client)

client.on('error', function (error) {
  console.error(error)
})

const getQueue = async (req, res) => {
  let totalNumber
  const response = { success: false, message: 'Service location not found' }

  const { serviceLocation } = req.params

  if (serviceLocation) {
    totalNumber = await HGET('location', serviceLocation)
  }

  if (totalNumber) {
    let queueNumber
    const currentQueue = await LPOS(serviceLocation, req.fcmToken)

    if (currentQueue !== null) {
      queueNumber = currentQueue + 1

      response.success = true
      response.exist = true
      response.queue = queueNumber
      response.queueStatus = 'WAITING'
      response.message = `You're enqueue at ${serviceLocation}. You are number ${queueNumber} in line.`
      response.location = serviceLocation
    } else {
      res.status(404)
      response.message = "Queue not found. You're not enqueue in this location."
    }

    if (queueNumber <= totalNumber) {
      response.queueStatus = 'PENDING'
      response.message = `Your turn to use the washing machine at ${serviceLocation}. You are number ${queueNumber} in line.`
    }

    if (timers[serviceLocation] && timers[serviceLocation][req.fcmToken]) {
      response.queueStatus = 'ACTIVE'
      response.message = `You're using washing machine at ${serviceLocation}.`
      response.startTime = timers[serviceLocation][req.fcmToken].startTime
      response.timeLeft =
        timers[serviceLocation][req.fcmToken].duration -
        (new Date().getTime() -
          timers[serviceLocation][req.fcmToken].startTime) /
          1000
    }

    res.json(response)
    return
  }
  res.status(404).json(response)
}

module.exports = getQueue
