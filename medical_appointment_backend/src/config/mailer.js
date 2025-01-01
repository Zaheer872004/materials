import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// console.log(process.env.EMAIL_USER);
// console.log(process.env.EMAIL_PASS);


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true // Enable debug logs
});

// Add this to debug the configuration
console.log('Email Configuration:', {
    user: process.env.EMAIL_USER,
    passIsSet: !!process.env.EMAIL_PASS
});

transporter.verify(function (error, success) {
    if (error) {
        console.log('SMTP Error:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

export default transporter;