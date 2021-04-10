const redis = require('redis')
const { promisify } = require('util')

const client = redis.createClient()
const RPUSH = promisify(client.rpush).bind(client)
const HGET = promisify(client.hget).bind(client)
const LPOS = promisify(client.lpos).bind(client)

client.on('error', function (error) {
  console.error(error)
})

const postQueue = async (req, res) => {
  let totalNumber
  const response = { success: false, message: 'Service location not found' }

  const { serviceLocation } = req.body

  if (serviceLocation) {
    totalNumber = await HGET('location', serviceLocation)
  }

  if (totalNumber) {
    const currentQueue = await LPOS(serviceLocation, req.fcmToken)

    if (currentQueue !== null) {
      response.exist = true
      response.message = 'Queue already exist'
    } else {
      const newQueue = await RPUSH(serviceLocation, req.fcmToken)

      response.queueStatus = 'WAITING'
      response.message = `You're enqueue at ${serviceLocation}. You are number ${newQueue} in line.`
      response.queue = newQueue
      response.location = serviceLocation

      if (newQueue <= totalNumber) {
        response.queueStatus = 'PENDING'
        response.message = `Your turn to use the washing machine at ${serviceLocation}. You are number ${newQueue} in line.`
      }
    }

    response.success = true
    res.json(response)
    return
  }
  res.status(404).json(response)
}

module.exports = postQueue
