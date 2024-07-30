const Feedback = require('../models/Feedback');

const submitFeedback = async (req, res) => {
    const { rating, comments } = req.body;
    const userId = req.user.id;

    try {
        const feedback = new Feedback({ userId, rating, comments });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully.' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find().populate('userId', 'username');
        res.status(200).json(feedback);
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { submitFeedback, getAllFeedback };
