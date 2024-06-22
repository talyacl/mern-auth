const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173'}));

// Connect to MongoDB
connectDB();

// User Model
const User = mongoose.model('User', {
    username: String,
    password: String
});

// JWT Secret
const jwtSecret = 'secret';

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  res.json({ message: 'User registered successfully' });
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Invalid password' });
  }
  const token = jwt.sign({ userId: user._id }, jwtSecret);
  res.json({ token });
});

// Protected Route
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
