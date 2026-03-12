import cookieParser from "cookie-parser";
import express from "express";

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(express.static("/public"))
app.use(cookieParser())

// Routes
import router from "./src/modules/auth/auth.routes.js";
import productRouter from "./src/modules/product/product.routes.js";
import cartRouter from "./src/modules/cart/cart.routes.js";
import orderRouter from "./src/modules/order/order.routes.js"
import addressRouter from "./src/modules/address/address.routes.js"
// Mount the  routes
app.use("/api/v1/auth" , router)
app.use("/api/v1/product" , productRouter)
app.use("/api/v1/cart" , cartRouter)
app.use("/api/v1/order" , orderRouter)
app.use("/api/v1/address" , addressRouter)

export {app}