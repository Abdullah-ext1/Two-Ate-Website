import { Router } from "express";
import {
    createAddress,
    getMyAddress,
    updateAddress,
    deleteAddress
} from "./address.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js"

const router = Router()
router.route("/create").post(verifyJWT, createAddress)
router.route("/getMyAddress").get(verifyJWT, getMyAddress)
router.route("/update").post(verifyJWT, updateAddress)
router.route("/:id").delete(verifyJWT, deleteAddress)


export default router