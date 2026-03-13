import dotenv from "dotenv"
dotenv.config({ path:  './.env'})

import mongoose from "mongoose"
import { Product } from "./src/modules/product/product.model.js"
import cloudinary from "./src/config/cloudinary.js"

await mongoose.connect(process.env.MONGODB_URI)

const heelsData = [
    { name: "Até- Gold & Crystal adorned heels", color: "Gold", folder: "heels/heel.1", price: 12000, discountedPrice: 5999 },
    { name: "Athena's Charm- Black Rhinestone bow tie-up Heels", color: "Black", folder: "heels/heel.2", price: 9900, discountedPrice: 2500 },
    { name: "Eris’s Flame- Cherry Red Heels", color: "Red", folder: "heels/heel.3", price: 11000, discountedPrice: 5599 },
    { name: "Hera’s Grace- White Leather Platforms", color: "White", folder: "heels/heel.4", price: 10500, discountedPrice: 5999 },
    { name: "Ken- Pink Satin Crystal Heels", color: "Pink", folder: "heels/heel.5", price: 3799, discountedPrice: 3799 },
    { name: "Medusa's Kiss- Gold snake skin texture platforms", color: "Gold", folder: "heels/heel.6", price: 10500, discountedPrice: 5999 },
    { name: "Nyx's Noir- Black Satin Platforms", color: "Black", folder: "heels/heel.7", price: 10500, discountedPrice: 5999 },
    { name: "Psyche's Wings- Butterfly tie up Heels", color: "Pink", folder: "heels/heel.8", price: 6000, discountedPrice: 4199 }
]

for (const heel of heelsData) {

    const images = await cloudinary.search
        .expression(`folder:${heel.folder}`)
        .execute()

    const imageUrls = images.resources.map(img => img.secure_url)

    await Product.create({
        name: heel.name,
        description: "Elegant luxury heel designed for modern fashion.",
        price: heel.price,
        discountedPrice: heel.discountedPrice,
        category: "heels",
        color: heel.color,
        images: imageUrls,
        createdBy: "69b32f1329c41e222ba24fda",
        sizes: [
            { size: 35, stock: 1 },
            { size: 36, stock: 3 },
            { size: 37, stock: 2 },
            { size: 38, stock: 2 },
            { size: 39, stock: 4 },
            { size: 40, stock: 5 },
            { size: 41, stock: 3 },
            { size: 42, stock: 2 },
        ]
    })

}

console.log("All 8 heels inserted successfully")

process.exit()