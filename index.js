const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const dotenv=require('dotenv')

dotenv.config();
const PORT=process.env.PORT ||6000;

const app = express();
app.use(express.json()); // for parsing application/json


mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log(err));


app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

 
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

   
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
