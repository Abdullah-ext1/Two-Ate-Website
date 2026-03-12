import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponce.js";
import { Cart } from "../cart/cart.models.js";
import { Order } from "./order.model.js";

const create = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is Empty")
    }

    let totalAmount = 0

    cart.items.forEach(item => {
        totalAmount += item.priceSnapshot * item.quantity
    });

    const order = await Order.create({
        user: req.user._id,
        items: cart.items,
        totalAmount
    })

    cart.items = []
    await cart.save()

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                { order },
                "Order placed Successfully"
            )
        )

})

const getMyOrder = asyncHandler(async (req, res) => {

    const page = req.query.page || 1
    const limit = 10

    const orders = await Order
        .find({ user: req.user._id })
        .populate("items.product")
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)


    //-1 → newest first (descending)
    //1→ oldest first (ascending)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                orders,
                "Fetched my order Successfully"
            )
        )
})

const getSingleOrder = asyncHandler(async (req, res) => {

    const { orderId } = req.params

    const order = await Order.findById(orderId)
        .populate("items.product")

    if (!order) {
        throw new ApiError(400, "Order Not Found")
    }
    if (order.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized access to this order")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                order,
                "Fetched order Successfully"
            )
        )
})

const orderStatus = asyncHandler(async (req, res) => {
    // 1 get orderId
    // 2 find order
    // 3 if not found → error
    // 4 update orderStatus
    // 5 save order
    // 6 return updated order
    const { orderId } = req.params
    const { orderStatus } = req.body


    const order = await Order.findById(orderId)
    if (!order) {
        throw new ApiError(400, "Order Not Found")
    }

    order.orderStatus = orderStatus
    await order.save()

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order status updated successfully"
        )
    )

})
export {
    create,
    getMyOrder,
    getSingleOrder,
    orderStatus

}