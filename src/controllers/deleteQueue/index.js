const redis = require('redis')
const { promisify } = require('util')
const { publishMessage, sendPushNotification } = require('../../models')
const { timers } = require('../../helpers')

const client = redis.createClient()
const HGET = promisify(client.hget).bind(client)
const LPOS = promisify(client.lpos).bind(client)
const LRANGE = promisify(client.lrange).bind(client)
const LREM = promisify(client.lrem).bind(client)

client.on('error', function (error) {
  console.error(error)
})

const deleteQueue = async (req, res) => {
  const { serviceLocation } = req.body
  const totalNumber = await HGET('location', serviceLocation)
  const response = { success: false, message: 'Service location not found' }

  if (totalNumber) {
    let remove = false
    const currentQueue = await LPOS(serviceLocation, req.fcmToken)

    if (currentQueue !== null) {
      const isRemove = await LREM(serviceLocation, 0, req.fcmToken)
      remove = isRemove
    }

    if (remove) {
      const queueListInLocation = await LRANGE(serviceLocation, 0, -1)
      timers[serviceLocation][req.fcmToken] && delete timers[serviceLocation][req.fcmToken]

      if (currentQueue + 1 <= totalNumber) {
        const [nextQueue] = queueListInLocation.slice(
          totalNumber - 1,
          totalNumber,
        )
        sendPushNotification(nextQueue)
      }

      publishMessage(serviceLocation, 'QUEUE_UP')

      response.success = true
      response.message =
        'Thank you. We hope your experience was awesome and we can’t wait to see you again soon.'
    } else {
      res.status(404)
      response.message = 'Queue not found'
    }

    res.json(response)
    return
  }

  res.status(404).json(response)
}

module.exports = deleteQueue
