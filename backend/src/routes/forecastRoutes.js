// routes/forecastRoutes.js
const express = require('express');
const router = express.Router();
const { saveForecast, getForecasts } = require('../controllers/forecastController');
const jwt = require('jsonwebtoken');
const secretKey = 'Marvel##';

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

router.post('/forecasts', authenticateToken, saveForecast);
router.get('/forecasts', authenticateToken, getForecasts);

module.exports = router;
