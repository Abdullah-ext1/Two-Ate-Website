import {Router} from 'express';
import {createProduct , getALLproducts , getProductById} from "./product.controller.js"

const router = Router();

router.route("/create").post(createProduct);
router.route("/").get(getALLproducts);
router.route("/:id").get(getProductById);

export default router;