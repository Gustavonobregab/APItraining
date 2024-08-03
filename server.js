import express from 'express'
import mongoose from 'mongoose'
import Centro from './models/centro.model.js'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello Node Api')
})

//Criar centro (modelo no centro.models.js)
app.post('/centro', async (req, res) => {
  try {
    const centro = await Centro.create(req.body)
    res.status(200).json(centro)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message })
  }
})

//Obter todos os centros
app.get('/centro', async (req, res) => {
  try {
    const centros = await Centro.find({})
    res.status(200).json(centros)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Atualizar quantidade de pessoas pelo nome da aldeia:
app.put('/centro/nome/:nome', async (req, res) => {
  try {
    const nome = req.params.nome
    const { quantidadePessoas } = req.body
    const centro = await Centro.findOne({ nome: nome })

    if (!centro) {
      return res.status(404).json({ message: 'Centro não encontrado' })
    }

    if (quantidadePessoas > centro.capacidadeMax) {
      return res
        .status(400)
        .json({ message: 'Quantidade de pessoas excede a capacidade máxima.' })
    }

    const updatedCentro = await Centro.findOneAndUpdate(
      { nome: nome },
      { quantidadePessoas: quantidadePessoas },
      { new: true }
    )

    if (!updatedCentro) {
      return res.status(404).json({ message: 'Erro ao atualizar o centro' })
    }

    res.status(200).json(updatedCentro)
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar o centro' })
  }
})

//Conectar com banco de dados
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

//Rodar
app.listen(3000, () => {
  console.log(`Node Api is running on port 3000`)
})
