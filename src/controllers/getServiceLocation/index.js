const redis = require('redis')
const { promisify } = require('util')

const client = redis.createClient()
const HGETALL = promisify(client.hgetall).bind(client)

client.on('error', function (error) {
  console.error(error)
})

const getServiceLocation = async (req, res) => {
  const serviceLocation = await HGETALL('location')
  const serviceLocationArray = []

  for (const location in serviceLocation) {
    serviceLocationArray.push({
      location,
      totalNumber: parseInt(serviceLocation[location]),
    })
  }
  res.json({ success: true, serviceLocation: serviceLocationArray })
}

module.exports = getServiceLocation
