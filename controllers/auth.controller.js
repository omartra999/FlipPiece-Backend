const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendConfirmationEmail } = require('../utils/email');
const { isStrongPassword } = require('../utils/strongPassword'); 

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Basic validation
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.',
      });
    }    

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate confirmation code
    const confirmationCode = crypto.randomInt(100000, 999999).toString();

    // Create user (inactive)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isActive: false,
      confirmationCode,
    });

    // Send confirmation email
    await sendConfirmationEmail(email, confirmationCode);

    res.status(201).json({ message: 'Registration successful. Please check your email for the confirmation code.' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account not activated. Please confirm your email.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
};

exports.confirm = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || user.confirmationCode !== code) {
      return res.status(400).json({ message: 'Invalid confirmation code.' });
    }
    user.isActive = true;
    user.confirmationCode = null;
    await user.save();
    res.json({ message: 'Account activated. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Confirmation failed.', error: err.message });
  }
};