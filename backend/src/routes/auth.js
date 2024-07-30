const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const isValidObjectId = require('../utils/isValidObjectId');
const secretKey = 'Marvel##';

// Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password, accountBalance } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with that email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            accountBalance: accountBalance || 0.0
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully.',
            token: jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' })
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

        res.status(200).json({
            message: 'User logged in successfully',
            token,
            userId: user._id,
            name: user.username,
            accountBalance: user.accountBalance
        });
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Fetch user details
router.get('/user', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id, 'id username email name job bio age salary accountBalance');

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ error: 'Failed to authenticate token.' });
    }
});

// Update user details
router.put('/user', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { name, job, bio, age, salary, accountBalance } = req.body;

    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.name = name || user.name;
        user.job = job || user.job;
        user.bio = bio || user.bio;
        user.age = age || user.age;
        user.salary = salary || user.salary;
        user.accountBalance = accountBalance || user.accountBalance;

        await user.save();

        res.status(200).json(user);
    } catch (err) {
        console.error('Error updating user profile:', err);
        res.status(500).json({ error: 'Failed to update user profile.' });
    }
});

// Fetch user balance
router.get('/:userId/balance', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ balance: user.accountBalance });
    } catch (error) {
        console.error('Error fetching user balance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
