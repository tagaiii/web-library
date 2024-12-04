import 'dotenv/config'
import express from 'express'
import sequelize from './db.js'
import router from './routes/index.js'
import cors from 'cors'

const PORT = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use('/api', router)

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()
