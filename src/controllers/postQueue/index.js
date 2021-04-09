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
  const { serviceLocation } = req.body
  const totalNumber = await HGET('location', serviceLocation)
  const response = { success: false, message: 'service location not found' }

  if (totalNumber) {
    let queueNumber
    const isQueueExist = await LPOS(serviceLocation, req.fcmToken)

    if (!isQueueExist) {
      queueNumber = await RPUSH(serviceLocation, req.fcmToken)
    } else {
      queueNumber = isQueueExist
      response.exist = true
    }
    response.success = true
    response.queue = queueNumber
    response.queueStatus = 'IN_LINE'
    response.message = `You're enqueue at ${serviceLocation}. You are number ${
      queueNumber + 1
    } in line.`

    if (queueNumber <= totalNumber) {
      response.queueStatus = 'ACTIVE'
      response.message = `Your turn to use the washing machine at ${serviceLocation}. You are number ${
        queueNumber + 1
      } in line.`
    }
    res.json(response)
    return
  }
  res.status(404).json(response)
}

module.exports = postQueue
