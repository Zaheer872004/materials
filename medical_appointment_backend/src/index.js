import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";
dotenv.config({}) // automatically detect the .env file 


const PORT = process.env.PORT || 4000


connectDB().then(() => {
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`)
    })
}).catch((err) => {
    console.log(err)
    logger.error(err.message)
})

