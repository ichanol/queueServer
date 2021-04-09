const admin = require('firebase-admin')
const { bookingApp } = require('../../helpers')

admin.initializeApp({
  credential: admin.credential.cert(bookingApp),
})

const sendPushNotification = async (token, TYPE, topic) => {
  const payload = {
    notification: {
      title: 'ถึงคิวของคุณแล้ว',
      body: 'กรุณายืนยันการใช้งานภายใน 10 นาที',
    },
  }

  if (token) {
    payload.token = token
  }

  if (topic) {
    payload.topic = topic
  }

  switch (TYPE) {
    case 'FINISH':
      payload.notification.title = 'การซักผ้าเสร็จสิ้น'
      payload.notification.body = 'การซักผ้าเสร็จเรียบร้อย กรุณาเก็บผ้า'
      break
    default:
      break
  }

  return (token || topic) && (await admin.messaging().send(payload))
}

module.exports = sendPushNotification
