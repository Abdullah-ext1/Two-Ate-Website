import mongoose , {Schema} from "mongoose";
 
const cartSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    items: [{
        product: {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        size: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        priceSnapshot: {
            type: Number,
            required: true
        }

}]
},{timestamps : true})

export const Cart = mongoose.model("Cart" , cartSchema)