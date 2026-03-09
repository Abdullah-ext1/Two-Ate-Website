import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            size: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            priceSnapshot: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["Pending","Shipped","Delivered"],
        default: "Pending"
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid"],
        default: "Pending"
    },
    shippingAddress:{
        type: String,
        required: true
    }


}, { timestamps: true })

export const Order = mongoose.model("Order", orderSchema)
