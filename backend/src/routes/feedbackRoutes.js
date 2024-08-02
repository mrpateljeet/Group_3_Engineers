const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');
const jwt = require('jsonwebtoken');
const secretKey = 'Marvel##';
const refreshTokens = []; // Store refresh tokens in memory (use a database in production)

// Middleware to authenticate access token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Session expired. Please log in again.' });
            }
            return res.status(500).json({ error: 'Failed to authenticate token.' });
        }

        req.user = decoded; // Attach the decoded user data to the request object
        next();
    });
};

// Generate access and refresh tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '7d' });
    refreshTokens.push(refreshToken); // Store the refresh token
    return { accessToken, refreshToken };
};

// Refresh token endpoint
router.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ error: 'Invalid refresh token.' });
    }

    jwt.verify(refreshToken, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid refresh token.' });
        }

        const user = { id: decoded.userId }; // Simulate user retrieval
        const { accessToken, newRefreshToken } = generateTokens(user);

        // Replace the old refresh token with the new one
        const index = refreshTokens.indexOf(refreshToken);
        if (index > -1) {
            refreshTokens.splice(index, 1);
        }
        refreshTokens.push(newRefreshToken);

        res.json({ accessToken, refreshToken: newRefreshToken });
    });
});

router.post('/feedback', authenticateToken, submitFeedback);
router.get('/feedback', authenticateToken, getAllFeedback);

module.exports = router;
