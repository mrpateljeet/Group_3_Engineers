import React, { useState, useEffect } from 'react';
import './ForecastForm.css';

const ForecastForm = ({ onForecast, saveForecast }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [allocationPercentage, setAllocationPercentage] = useState('');
    const [forecastResult, setForecastResult] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setCurrentAmount(data.accountBalance);
            setMonthlyIncome(data.salary);
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const forecastData = {
            targetAmount,
            currentAmount,
            monthlyIncome,
            allocationPercentage
        };

        const result = await onForecast(forecastData);
        setForecastResult(result);

        if (window.confirm("Do you want to record this forecast and get updates regarding it?")) {
            await saveForecast({ name, ...forecastData, months: result.months });
            setTimeout(() => {
                window.location.href = '/add-goal';
            }, 3000);
        }
    };

    return (
        <div className="forecast-container">
            <form onSubmit={handleSubmit} className="forecast-form">
                <div className="form-group2">
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Target Amount:</label>
                    <input
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Current Amount:</label>
                    <input
                        type="number"
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Monthly Income:</label>
                    <input
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Allocation Percentage:</label>
                    <input
                        type="number"
                        value={allocationPercentage}
                        onChange={(e) => setAllocationPercentage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="forecast-button">Forecast</button>
            </form>

            {forecastResult && (
                <div className="forecast-result">
                    <h3>Forecast Result</h3>
                    <p>Months to achieve goal: {forecastResult.months}</p>
                </div>
            )}
        </div>
    );
};

export default ForecastForm;
