import { asyncHandler } from "../../utils/asyncHandler.js";
import { Product } from "./product.model.js";
import ApiError from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponce.js";

const createProduct = asyncHandler(async (req , res) => {
    const {name , description , price , category , sizes , color , images , discountedPrice} = req.body

    if(
        [name , description , price , category , sizes , color , images ].some((feild) => feild === "" || feild === undefined)
    ){
        throw new ApiError(400 , "All Feilds Are Required")
    }
    const product = await Product.create({
        name,
        description,
        price,
        category,
        sizes,
        images,
        color,
        discountedPrice,
        createdBy : req.user._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            product, 
            "Product created successfully")
    )
})

const getALLproducts = asyncHandler(async (req , res) => {

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const products = await Product.find().skip(skip).limit(limit)
    const total = await Product.countDocuments()
    const totalPages = Math.ceil(total / limit)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                products,
                total,
                totalPages,
                currentPage: page
            },
            "Products fetched successfully"
        )
    )
})

const getProductById = asyncHandler(async (req , res) => {
    const {id} = req.params 

    const product = await Product.findById(id)

    if(!product){
        throw new ApiError(404 , "Product not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            "Product fetched successfully"
        )
    )
})

export {createProduct , getALLproducts , getProductById}
