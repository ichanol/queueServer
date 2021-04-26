const timers = require('../timers')

const setTimer = (serviceLocation, id, duration, callback = () => {}) => {
  if (!timers[serviceLocation]) {
    timers[serviceLocation] = {}
  }

  clearTimeout(timers[serviceLocation][id])

  const timeMillis = new Date().getTime()

  timers[serviceLocation][id] = setTimeout(async () => {
    console.log(id, ' timeout', duration)
    callback()
    timers[serviceLocation][id].status = 'FINISHING'
  }, duration * 1000)

  timers[serviceLocation][id].startTime = timeMillis
  timers[serviceLocation][id].duration = duration

  return timeMillis
}

module.exports = setTimer
