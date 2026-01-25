import dotenv from 'dotenv';
import nodemailer from "nodemailer";

dotenv.config();

const mail = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    debug: true,
    logger: true,
});

export default mail;