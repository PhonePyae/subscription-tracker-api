import nodemailer from 'nodemailer';
import { config } from 'dotenv'; 
config({ path: './config/config.env' });

export const accountEmail = process.env.EMAIL_USER;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    }
});

export default transporter;
  