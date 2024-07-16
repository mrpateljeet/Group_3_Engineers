// controllers/forecastController.js
const Forecast = require('../models/Forecast');

const saveForecast = async (req, res) => {
    const { name, targetAmount, currentAmount, monthlyIncome, allocationPercentage, months } = req.body;
    const userId = req.user.id; // Assuming req.user contains the authenticated user's data

    try {
        const forecast = new Forecast({
            name,
            targetAmount,
            currentAmount,
            monthlyIncome,
            allocationPercentage,
            months,
            userId
        });
        await forecast.save();
        res.status(201).json(forecast);
    } catch (error) {
        console.error('Error saving forecast:', error);
        res.status(500).json({ error: 'Failed to save forecast' });
    }
};

const getForecasts = async (req, res) => {
    try {
        const forecasts = await Forecast.find({ userId: req.user.id });
        res.status(200).json(forecasts);
    } catch (error) {
        console.error('Error fetching forecasts:', error);
        res.status(500).json({ error: 'Failed to fetch forecasts' });
    }
};

module.exports = { saveForecast, getForecasts };
