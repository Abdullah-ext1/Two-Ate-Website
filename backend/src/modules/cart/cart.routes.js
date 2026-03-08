import {Router} from "express"
import {
     addToCart,
     getCart,
     updateCart,
     removeItem,
     deletecart

 } from "./cart.controller.js"
import { verifyJWT } from "../../middleware/auth.middleware.js"

const router = Router() 
router.route("/add").post(verifyJWT , addToCart)
router.route("/getCart").get(verifyJWT , getCart)
router.route("/updateCart").patch(verifyJWT , updateCart)
router.route("/remove/:itemId").delete( verifyJWT, removeItem)
router.route("/clear").delete( verifyJWT, deletecart)

export default router