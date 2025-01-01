import express from "express";
import logger from "./utils/logger.js";
import morgan from "morgan";
import cors from 'cors';
// import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

const app = express();


// we can customise the origin as well here, adding multiple origin.
// for now no need of cors origin, we can use it later.
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }))


// commmon middleware here on express
app.use(express.json()) // req size must be less or equal to 20kb.
app.use(express.urlencoded({ extended: true })) // req data must be url encoded like @ # $ like this 
app.use(express.static("public"))
// app.use(cookieParser())





const morganFormat = ":method :url :status :response-time ms";
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);


// here our routes middleware
import slotRoutes from './routes/slot.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';

app.use('/api/appointments', appointmentRoutes);
app.use('/api/slots', slotRoutes);


// Schedule no-show check every 5 minutes
import appointmentService from "./services/appointment.service.js";
import cron from 'node-cron';
cron.schedule('*/15 * * * *', () => {
    appointmentService.checkNoShows();
});


// here our custom error response middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof ApiError) {
        return res
                .status(err.statusCode)
                .json({
                    statusCode: err.statusCode,
                    message: err.message,
                    success: err.success,
                    errors: err.errors, // Use `errors` from ApiError class
                    stack: err.stack // Optionally include stack trace if needed
                });
    }

    return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        success: false
    });
});






export {
    app,
}
