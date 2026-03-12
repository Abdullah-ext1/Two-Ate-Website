import mongoose, { Schema } from "mongoose"

const addressSchema = new Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  fullName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  street: {
    type: String,
    required: true
  },

  city: {
    type: String,
    required: true
  },

  state: {
    type: String,
    required: true
  },

  pinCode: {
    type: String,
    required: true
  },

  country: {
    type: String,
    required: true
  },

  isDefault: {
    type: Boolean,
    default: false
  }

}, { timestamps: true })

export const Address = mongoose.model("Address", addressSchema)