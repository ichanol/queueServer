const ampq = require('amqplib')

const publishMessage = async (serviceLocation, TYPE) => {
  const connection = await ampq.connect({
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/',
  })
  const key = `#.${serviceLocation}`
  const channel = await connection.createChannel()
  const exchangeInstance = await channel.assertExchange(
    serviceLocation,
    'topic',
  )

  const date = new Date()
  console.log(
    `[PUBLISH] ${TYPE}@${serviceLocation} (${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()})`,
  )

  channel.publish(serviceLocation, key, Buffer.from(TYPE))

  setTimeout(() => {
    connection.close()
  }, 1000)
}

module.exports = publishMessage
