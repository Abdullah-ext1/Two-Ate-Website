import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponce.js";
import { Address } from "./adress.model.js";

const createAddress = asyncHandler(async (req, res) => {

    const { fullName, phone, street, city, state, pinCode, country } = req.body 

    if (!fullName || !phone || !street || !city || !state ||  !pinCode || !country) {
        throw new ApiError(400, "All fields are required")
    }   

    const address = await Address.create({
        user: req.user._id,
        fullName: fullName,
        phone,
        street,
        city,
        state,
        pinCode,
        country
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { address },
                "Address added successfully"
            )
        )           
})

const getMyAddress = asyncHandler(async (req, res) => {

    const addresses = await Address.find({ user: req.user._id }).sort({ createdAt: -1 })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { addresses },
                "Address fetched successfully"
            )
        )           
})

const updateAddress = asyncHandler(async (req, res) => {

  const { addressId } = req.params

  const address = await Address.findByIdAndUpdate(
    addressId,
    req.body,
    { new: true }
  )

  if (!address) {
    throw new ApiError(404, "Address not found")
  }

  return res.status(200).json(
    new ApiResponse(200, address, "Address updated")
  )
})


const deleteAddress = asyncHandler(async (req, res) => {

    const addressId = req.params.id

    const address = await Address.findOne({ _id: addressId, user: req.user._id })

    if (!address) {
        throw new ApiError(404, "Address not found")
    }

    await address.remove()

    return res  
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Address deleted successfully"
            )
        )           
})


export {
    createAddress,
    getMyAddress,
    updateAddress,
    deleteAddress
}
