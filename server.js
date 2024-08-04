import express from 'express'
import mongoose from 'mongoose'
import Centro from './models/centro.model.js'
import Intercambio from './models/intercambio.model.js'

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

app.get('/media/centro', async (req, res) => {
  try {
    const centros = await Centro.find({})

    if (centros.length === 0) {
      return res.status(404).json({ message: 'Nenhum centro encontrado' })
    }

    let totalMedicos = 0
    let totalVoluntarios = 0
    let totalVeiculos = 0
    let totalKitsMedicos = 0

    centros.forEach((centro) => {
      totalMedicos += centro.recursosCentro.medicos
      totalVoluntarios += centro.recursosCentro.voluntarios
      totalVeiculos += centro.recursosCentro.veiculos
      totalKitsMedicos += centro.recursosCentro.kitsMedicos
    })

    const mediaMedicos = totalMedicos / centros.length
    const mediaVoluntarios = totalVoluntarios / centros.length
    const mediaVeiculos = totalVeiculos / centros.length
    const mediaKitsMedicos = totalKitsMedicos / centros.length

    res.status(200).json({
      mediaMedicos,
      mediaVoluntarios,
      mediaVeiculos,
      mediaKitsMedicos,
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: `Erro ao calcular médias: ${error.message}` })
  }
})

// Fazendo intercâmbio de suprimentos
app.post('/intercambio', async (req, res) => {
  const { centroOrigemId, centroDestinoId, recursos } = req.body

  try {
    const centroOrigem = await Centro.findById(centroOrigemId)
    const centroDestino = await Centro.findById(centroDestinoId)

    if (!centroOrigem || !centroDestino) {
      return res.status(404).json({ message: 'Centro(s) não encontrado(s)' })
    }

    const recursosValidos = [
      'medicos',
      'voluntarios',
      'veiculos',
      'kitsMedicos',
    ]
    for (const recurso in recursos) {
      if (!recursosValidos.includes(recurso)) {
        return res.status(400).json({ message: `Recurso inválido: ${recurso}` })
      }
      if (recursos[recurso] < 0) {
        return res
          .status(400)
          .json({ message: `Quantidade de ${recurso} deve ser positiva` })
      }
    }

    const valorRecursos = {
      medicos: 4,
      voluntarios: 3,
      veiculos: 5,
      kitsMedicos: 7,
    }

    const pontosOrigem = Object.keys(recursos).reduce((total, recurso) => {
      return total + recursos[recurso] * valorRecursos[recurso]
    }, 0)

    if (centroOrigem.quantidadePessoas / centroOrigem.capacidadeMax > 0.9) {
    }

    const pontosDestino = Object.keys(recursos).reduce((total, recurso) => {
      return total + recursos[recurso] * valorRecursos[recurso]
    }, 0)

    if (pontosOrigem !== pontosDestino) {
      return res
        .status(400)
        .json({ message: 'Os pontos dos recursos devem ser iguais' })
    }

    for (const recurso in recursos) {
      centroOrigem.recursosCentro[recurso] -= recursos[recurso]
      centroDestino.recursosCentro[recurso] += recursos[recurso]
    }

    await centroOrigem.save()
    await centroDestino.save()

    const intercambio = new Intercambio({
      centroOrigem: centroOrigemId,
      centroDestino: centroDestinoId,
      recursosOrigem: recursos,
      recursosDestino: recursos,
    })

    await intercambio.save()

    res
      .status(200)
      .json({ message: 'Intercâmbio realizado com sucesso', intercambio })
  } catch (error) {
    res
      .status(500)
      .json({ message: `Erro ao realizar intercâmbio: ${error.message}` })
  }
})

// id1:66ae174aee8e0f1968780072 ; 66ae187dee8e0f1968780074

app.delete('/centro/:id', async (req, res) => {
  try {
    const centroId = req.params.id
    const centro = await Centro.findByIdAndDelete(centroId)

    if (!centro) {
      return res.status(404).json({ message: 'Centro não encontrado' })
    }

    res.status(200).json({ message: 'Centro deletado com sucesso' })
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar o centro' })
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
