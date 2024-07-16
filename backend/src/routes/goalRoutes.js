const express = require('express');
const router = express.Router();
const { addGoal, forecastGoal, saveForecast } = require('../controllers/goalController');
const jwt = require('jsonwebtoken');
const Goal = require('../models/Goal');
const secretKey = 'Marvel##'; // Replace with your secret key

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach the decoded user data to the request object
        next();
    } catch (err) {
        console.error('Failed to authenticate token:', err);
        res.status(500).json({ error: 'Failed to authenticate token.' });
    }
};

router.post('/goals', authenticateToken, addGoal);
router.post('/forecasts', authenticateToken, saveForecast);
router.post('/goals/forecast', authenticateToken, forecastGoal);
router.get('/goals', authenticateToken, async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id });
        res.status(200).json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
});

module.exports = router;
