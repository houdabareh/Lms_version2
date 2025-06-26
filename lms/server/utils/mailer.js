const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for GFS LMS Login',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>One-Time Password (OTP) for GFS LMS</h2>
        <p>Dear user,</p>
        <p>Your One-Time Password (OTP) for logging into GFS LMS is:</p>
        <h3 style="color: #4CAF50; font-size: 24px;">${otp}</h3>
        <p>This OTP is valid for 10 minutes. Please do not share this with anyone.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Best regards,<br/>The GFS LMS Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully to', email);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = sendOtpEmail;
