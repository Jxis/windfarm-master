const User = require("../models/User");
const sendEmail = require("../services/emailService");
const crypto = require("crypto");

const sendVerificationEmail = async (req, res) => {
  const { email, password } = req.body;

  // Proveri da li korisnik već postoji
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "Email already in use" });
  }

  // Kreiraj novog korisnika
  user = new User({ email, password });
  await user.save();

  // Kreiraj verifikacioni link
  const verificationLink = `http://localhost:3000/api/v1/verify-email?email=${email}`;

  // Pošalji e-mail korisniku
  await sendEmail(
    email,
    "Email Verification",
    `<p>Please verify your email by clicking on the following link: <a href="${verificationLink}">Verify Email</a></p>`
  );

  res.status(200).json({ message: "Verification email sent!" });
};

const verifyEmail = async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid verification link" });
  }

  user.isVerified = true;
  await user.save();

  res.status(200).json({ message: "Email successfully verified" });
};

module.exports = {
  sendVerificationEmail,
  verifyEmail,
};
