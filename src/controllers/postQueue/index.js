const redis = require('redis')
const { promisify } = require('util')

const client = redis.createClient()
const RPUSH = promisify(client.rpush).bind(client)
const HGET = promisify(client.hget).bind(client)
const LREM = promisify(client.lrem).bind(client)

client.on('error', function (error) {
  console.error(error)
})

const postQueue = async (req, res) => {
  const { serviceLocation } = req.body
  const totalNumber = await HGET('location', serviceLocation)

  if (totalNumber) {
    const isExist = await LREM(serviceLocation, 0, req.fcmToken)
    const queue = await RPUSH(serviceLocation, req.fcmToken)
    res.json({
      success: true,
      message: `You're enqueue at ${serviceLocation}. You are number ${queue} in line.`,
    })
    return
  }
  res
    .status(404)
    .json({ success: false, message: 'service location not found' })
}

module.exports = postQueue
