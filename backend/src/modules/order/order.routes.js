import { Router } from "express";
import {
    create,
    getMyOrder,
    getSingleOrder,
    orderStatus
} from "./order.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js"
import { verifyAdmin } from "../../middleware/verifyadmin.middleware.js";

const router = Router()

router.route("/create").post(verifyJWT, create)
router.route("/getOrder").get(verifyJWT, getMyOrder)
router.route("/:orderId").get(verifyJWT, getSingleOrder)
router.route("/status/:orderId").patch(verifyJWT,verifyAdmin, orderStatus)


export default router