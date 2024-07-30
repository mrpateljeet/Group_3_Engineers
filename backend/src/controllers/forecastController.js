// controllers/forecastController.js
const Forecast = require('../models/Forecast');
const User = require('../models/User'); 

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
        res.status(500).json({ error: 'Failed to save forecast' });
    }
};

const getForecasts = async (req, res) => {
    try {
        const forecasts = await Forecast.find({ userId: req.user.id });
        res.status(200).json(forecasts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch forecasts' });
    }
};

const payForecast = async (req, res) => {
    const { forecastId, allocatedMoney, userId } = req.body;

    try {
        // Find the user and forecast by their IDs
        const forecast = await Forecast.findById(forecastId);
        const user = await User.findById(userId);
            console.log(forecast);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!forecast) {
            return res.status(404).json({ error: 'Forecast not found' });
        }

        // Check if the user's account balance is less than the allocated money
        if (user.accountBalance < allocatedMoney) {
            return res.status(400).json({ error: 'Cannot process transaction: Low balance' });
        }

        // Deduct the allocated money from the user's account balance and add to amount received
        user.accountBalance -= allocatedMoney;
        forecast.amountReceived += allocatedMoney;
        forecast.months -= 1;

        const paymentDetail = {
            amount: allocatedMoney,
            date: new Date()
        };
        forecast.paymentHistory.push(paymentDetail);
        // Save the updated forecast and user
        await forecast.save();
        await user.save();

        res.status(200).json(forecast);
    } catch (error) {
        res.status(500).json({ error: 'Failed to process payment' });
    }
};

module.exports = { saveForecast, getForecasts,payForecast };
