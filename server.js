const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const router = require('./src/routers')

dotenv.config()
const PORT = process.env.PORT

const app = express()

app.use(cors())
app.use(express.json())
app.use(process.env.API_PATH, router)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
