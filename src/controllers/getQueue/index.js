const redis = require('redis')
const { promisify } = require('util')

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

    if ((await currentQueue) !== null) {
      queueNumber = currentQueue + 1
    }

    response.success = true
    response.exist = true
    response.queue = queueNumber
    response.queueStatus = 'IN_LINE'
    response.message = `You're enqueue at ${serviceLocation}. You are number ${queueNumber} in line.`
    response.location = serviceLocation

    if (queueNumber <= totalNumber) {
      response.queueStatus = 'PREPARE'
      response.message = `Your turn to use the washing machine at ${serviceLocation}. You are number ${queueNumber} in line.`
    }
    res.json(response)
    return
  }
  res.status(404).json(response)
}

module.exports = getQueue
