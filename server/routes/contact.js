const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Contact');
const transporter = require('../config/mailer');

router.post('/', async (req, res) => {
  try {
    const { fullName, emailAddress, phoneNumber, enquiryType, message } = req.body;

    if (!fullName || !emailAddress || !phoneNumber || !enquiryType || !message) {
      return res.status(400).json({ error: 'Please fill all required fields.' });
    }

    const newEnquiry = new Enquiry({ fullName, emailAddress, phoneNumber, enquiryType, message });
    await newEnquiry.save();

    const mailToBusiness = {
      from: process.env.EMAIL_USER,
      to: process.env.BUSINESS_EMAIL,
      subject: `New Enquiry: ${enquiryType}`,
      text: `
You have received a new enquiry:

Full Name: ${fullName}
Email: ${emailAddress}
Phone Number: ${phoneNumber}
Enquiry Type: ${enquiryType}
Message: ${message}
      `
    };

    const mailToCustomer = {
      from: process.env.EMAIL_USER,
      to: emailAddress,
      subject: 'Thank you for your enquiry',
      text: `Hi ${fullName},

Thank you for contacting us regarding "${enquiryType}". We have received your message and will get back to you shortly.

Your message:
${message}

Best regards,
Your Company Name
      `
    };

    await transporter.sendMail(mailToBusiness);
    await transporter.sendMail(mailToCustomer);

    res.status(200).json({ message: 'Enquiry received and emails sent successfully!' });
  } catch (error) {
    console.error('Error in /enquiry:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

module.exports = router;
