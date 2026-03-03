import express from "express";

const app = express()

app.use(express.json())

import router from "./src/modules/auth/auth.routes.js";
app.use("/api/v1/auth" , router)

export {app}