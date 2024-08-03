import mongoose from 'mongoose'

const intercambioSchema = new mongoose.Schema(
  {
    centroOrigem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Centro',
      required: true,
    },
    centroDestino: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Centro',
      required: true,
    },
    recursosOrigem: {
      type: Map,
      of: Number,
      required: true,
    },
    recursosDestino: {
      type: Map,
      of: Number,
      required: true,
    },
    data: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const Intercambio = mongoose.model('Intercambio', intercambioSchema)
export default Intercambio
