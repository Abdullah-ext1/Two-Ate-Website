import {Router} from 'express';
import {createProduct , getALLproducts , getProductById} from "./product.controller.js"
import { verifyJWT } from '../../middleware/auth.middleware.js';

const router = Router();

router.route("/create").post(verifyJWT ,  createProduct);
router.route("/").get(getALLproducts);
router.route("/:id").get(getProductById);

export default router;