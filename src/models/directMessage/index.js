const ampq = require('amqplib')

const directMessage = async (token, TYPE) => {
  const connection = await ampq.connect({
    protocol: 'amqp',
    hostname: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    vhost: '/',
  })
  const channel = await connection.createChannel()

  const date = new Date()
  console.log(
    `[PUBLISH] ${TYPE}@${token} (${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()})`,
  )

  channel.sendToQueue(token, Buffer.from(TYPE))

  setTimeout(() => {
    connection.close()
  }, 1000)
}

module.exports = directMessage
