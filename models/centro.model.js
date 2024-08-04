import mongoose from 'mongoose'

const centroSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Insira o nome do centro por favor.'],
      trim: true,
    },
    endereco: {
      type: String,
      required: [true, 'Insira o endereço por favor.'],
      trim: true,
    },
    localizacao: {
      type: String,
      required: [true, 'Insira a localização por favor.'],
      trim: true,
    },
    capacidadeMax: {
      type: Number,
      required: [true, 'Insira a capacidade máxima por favor.'],
      min: [1, 'A capacidade máxima deve ser pelo menos 1.'],
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} não é um número inteiro.',
      },
    },
    quantidadePessoas: {
      type: Number,
      required: [true, 'Insira a quantidade de pessoas por favor.'],
      default: 0,
      min: [0, 'A quantidade de pessoas não pode ser menor que 0.'],
      validate: {
        validator: function (value) {
          return value <= this.capacidadeMax
        },
      },
    },
    recursosCentro: {
      medicos: { type: Number, default: 0 },
      voluntarios: { type: Number, default: 0 },
      veiculos: { type: Number, default: 0 },
      kitsMedicos: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
)

const Centro = mongoose.model('Centro', centroSchema)
export default Centro
