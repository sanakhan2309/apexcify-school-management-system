import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (to, subject, text, html, attachments = []) => {
    try {
        const mailOptions = {
            from: `"EduFlow Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
            attachments // Support for attachments
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Email error: ', error);
        return null;
    }
};
