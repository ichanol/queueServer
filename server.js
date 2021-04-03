const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const router = require('./src/routers')

const app = express()

dotenv.config()
const PORT = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(process.env.API_PATH, router)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})
