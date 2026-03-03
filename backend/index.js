import dotenv from 'dotenv'
dotenv.config({ path:  './.env'}) 
import {connectDB} from "../backend/src/config/dbconnection.js"
import { app } from './app.js'


connectDB()
app.listen( process.env.PORT , () => {
    console.log(`Server is running at port ${process.env.PORT}`);
    
})