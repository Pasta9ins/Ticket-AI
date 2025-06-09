import { err } from 'inngest/types';
import nodemailer from 'nodemailer';

export const sendMail = async (to, subject, text) =>{
    try {
        const transporter = nodemailer.createTransport({

        //previous mailtrap    
        // host: process.env.MAILTRAP_SMTP_HOST,
        // port: process.env.MAILTRAP_SMTP_PORT,
        // secure: false, // true for 465, false for other ports
        // auth: {
        // user: process.env.MAILTRAP_SMTP_USER,
        // pass: process.env.MAILTRAP_SMTP_PASS,
        // },});

        host: process.env.GMAIL_SMTP_HOST,
        port: process.env.GMAIL_SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
        user: process.env.GMAIL_SMTP_USER,
        pass: process.env.GMAIL_SMTP_PASS,
        },});
        
        
        const info = await transporter.sendMail({
        from: '"INNGEST TMS" <chauanirudha@gmail.com>',
        to,
        subject,
        text,
        });

        console.log("Message sent:", info.messageId);

        // // New: Log the email envelope for more details on sender/recipients
        // console.log("Envelope:", info.envelope);
        // // New: Log the raw SMTP server response, which is crucial for debugging
        // console.log("Response:", info.response);

        return info
    } 
    
    catch (error) {
        console.error("Mailtrap Error", error);
        throw error;
    }
}