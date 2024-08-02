import express from 'express'
import mongoose from 'mongoose'
import Centro from './models/centro.model.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello Node Api')
})

app.get('/blog', (req, res) => {
  res.send('Hellobloggggggggggg')
})

app.post('/centro', async (req, res) => {
  try {
    const centro = await Centro.create(req.body)
    res.status(200).json(centro)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message })
  }
})

mongoose
  .connect(
    `mongodb+srv://gustavonobg:12345678i@phoebusapi.9xydyvr.mongodb.net/Node-API?retryWrites=true&w=majority&appName=PhoebusApi`
  )
  .then(() => {
    console.log('Connected to MongoDb')
  })
  .catch((error) => {
    console.log(error)
  })

app.listen(3000, () => {
  console.log(`Node Api is running on port 3000`)
})
