import mongoose , {Schema} from "mongoose";

const productSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    size: [
        {
            sizes : {
                type : String,
                required : true
            },
            stock : {
                type : Number,
                required : true
            }
        }
    ],
    color: {
        type : String,
        required : true
    },
    images: [ {
            type : String,
            required : true
    }],
    createdBy : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    },
    discountedPrice : {
        type : Number,
        required : true
    }

    
}, {timestamps : true});

export const Product = mongoose.model("Product" , productSchema)