const Goal = require('../models/Goal');
const Forecast = require('../models/Forecast');

const addGoal = async (req, res) => {
    const { name, targetAmount, targetDate } = req.body;
    const userId = req.user.id; // Assuming req.user contains the authenticated user's data

    try {
        const goal = new Goal({ name, targetAmount, targetDate, userId });
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        console.error('Error adding goal:', error);
        res.status(500).json({ error: 'Failed to add goal' });
    }
};

const forecastGoal = async (req, res) => {
    const { targetAmount, currentAmount, monthlyIncome, allocationPercentage } = req.body;

    try {
        const disposableIncome = (monthlyIncome * allocationPercentage) / 100;
        const remainingAmount = targetAmount - currentAmount;
        const monthsToGoal = Math.ceil(remainingAmount / disposableIncome);

        res.status(200).json({ months: monthsToGoal });
    } catch (error) {
        console.error('Error forecasting goal:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const saveForecast = async (req, res) => {
    const { name, targetAmount, currentAmount, monthlyIncome, allocationPercentage, months } = req.body;
    const userId = req.user.id;

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

module.exports = { addGoal, forecastGoal, saveForecast };
