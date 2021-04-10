const timers = require('../timers')

const setTimer = (serviceLocation, id, duration) => {
  if (!timers[serviceLocation]) {
    timers[serviceLocation] = {}
  }

  clearTimeout(timers[serviceLocation][id])

  const timeMillis = new Date().getTime()

  timers[serviceLocation][id] = setTimeout(() => {
    console.log(id, ' timeout', duration)
    delete timers[serviceLocation][id]
  }, duration * 1000)

  timers[serviceLocation][id].startTime = timeMillis
  timers[serviceLocation][id].duration = duration

  return timeMillis
}

module.exports = setTimer
