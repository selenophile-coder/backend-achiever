import express from 'express';
import nodemailer from 'nodemailer';
import Enquiry from '../models/Enquiry.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, contact } = req.body;
    // Save to DB
    const enquiry = new Enquiry({ name, email, contact });
    await enquiry.save();
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Library Enquiry',
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Contact:</strong> ${contact}</p>`
    });
    res.json({ message: 'Enquiry sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;