import {asyncHandler} from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponce.js";
import { Cart } from "./cart.models.js";
import { Product } from "../product/product.model.js";

const addToCart = asyncHandler(async (req , res) => {

    const {productId , size , quantity} = req.body
    

    const product = await Product.findById(productId)
    if (!product) {
        throw new ApiError(400 , "Product not found")
    }

    const selectsize = await product.sizes.find(s => s.size === size)

    if (!selectsize) {
         throw new ApiError(400 , "Size not Found")
    }

    if (selectsize.stock < quantity) {
         throw new ApiError(400 , "Item is not in stock ")
    }
    
    let cart = await Cart.findOne({user : req.user._id})
    if (!cart) {
       cart = await Cart.create({
        user: req.user._id,
        items: [{
            product: productId,
            size,
            quantity,
            priceSnapshot:product.price
        }]
       })
       return res
       .status(200)
       .json(
           new ApiResponse(
               200,
               {cart, totalPrice: product.price * quantity, totalItems: quantity},
               "Item added to cart successfully"
           )
       )
    }

    //Which array method can find the position of an item in array? : : findIndex()

    const checkSameItem =  cart.items.findIndex(
        item => item.product.toString() === productId && item.size === size
    )
    if (checkSameItem !== -1) {
        cart.items[checkSameItem].quantity += quantity
    } else {
        cart.items.push({
            product: productId,
            size,
            quantity,
            priceSnapshot:product.price
        })
    }

    await cart.save()
    
    let totalPrice = 0
    let totalItems = 0
    cart.items.forEach(item => {
        totalPrice += item.priceSnapshot * item.quantity
        totalItems += item.quantity
    })
    
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {cart, totalPrice, totalItems},
            "Item added to cart successfully"
        )
    )
})

const getCart = asyncHandler(async (req , res) => {

    const cart = await Cart.findOne({user : req.user._id}).populate("items.product")    
    if (!cart) {
        throw new ApiError(404 , "Cart not found")
    }    

    let totalPrice = 0
    let totalItems = 0
    cart.items.forEach(item => {
        totalPrice += item.priceSnapshot * item.quantity
        totalItems += item.quantity
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {cart, totalPrice , totalItems },
            "Cart fetched successfully"
        )
    )
})

const updateCart = asyncHandler(async (req , res) => {
    
    const {itemId , quantity} = req.body

    const cart = await Cart.findOne({user : req.user?._id})
    
    if(!cart){
        throw new ApiError(400 , "cart not Found")
    }
    
    const item = cart.items.find(item => item._id.toString() === itemId)
    
    if(!item){
        throw new ApiError(400 , "Item not found")
    }

    const product = await Product.findById(item.product)
    if(!product){
        throw new ApiError(400 , "Product not found")
    }
    const selectsize = product.sizes.find(s => s.size === item.size)

    if(!selectsize){
        throw new ApiError(400 , "Size not found")
    }
    if(selectsize.stock < quantity){
        throw new ApiError(400 , "Item is not in stock")
    }   
    item.quantity = quantity
    await cart.save()
        return res      
        .status(200)
        .json(
            new ApiResponse(
                200,
                cart,
                "Cart updated successfully"
            )
        )
    

})

const removeItem = asyncHandler(async (req , res) => {
        const {itemId} = req.params

        const cart = await Cart.findOne({user : req.user?._id})
        
        if(!cart){
            throw new ApiError(404 , "cart not Found")
        }   
        
        const item = cart.items.find(item => item._id === itemId)
        if (!item) {
            throw new ApiError(404 , "Item not Found In cart")
        }
        cart.items.pull(itemId)
        await cart.save()

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {cart},
                "Cart Updated SuccessFully"
            )
        )
    })

const deletecart = asyncHandler(async (req , res) => {
    
    const cart = await Cart.findOne({user : req.user._id})

    if (!cart) {
        throw new ApiError(404 , "Cart not found")
    }
    cart.items = []
    await cart.save()

    return res
    .status(200)
        .json(
            new ApiResponse(
                200,
                {cart},
                "Item from Cart removed SuccessFully"
            )
        )
})

export {
    addToCart,
    getCart,
    updateCart,
    removeItem,
    deletecart

}