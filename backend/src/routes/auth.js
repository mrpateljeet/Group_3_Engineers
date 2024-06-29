const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const secretKey = 'Marvel##'; // Replace with your secret key

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with that email.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const user = await User.create({ username, email, password: hashedPassword });
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully.', token });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });

        res.status(200).json({ message: 'User logged in successfully', token, name: user.username });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Fetch user profile
router.get('/user', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'username', 'email', 'name', 'job', 'bio', 'age', 'salary']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        console.log('Fetched User:', user);  // Log the user data
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Failed to authenticate token.' });
    }
});

// Update user profile
router.put('/user', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { name, job, bio, age, salary } = req.body;

    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.name = name || user.name;
        user.job = job || user.job;
        user.bio = bio || user.bio;
        user.age = age || user.age;
        user.salary = salary || user.salary;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully.', user });
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ error: 'Failed to update user profile.' });
    }
});

module.exports = router;
