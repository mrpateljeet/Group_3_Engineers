import React, { useState, useEffect } from 'react';
import './GoalForm.css';

const GoalForm = ({ onAdd, fetchGoals, fetchForecasts }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [goals, setGoals] = useState([]);
    const [forecasts, setForecasts] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await onAdd({ name, targetAmount, targetDate });
        const updatedGoals = await fetchGoals();
        setGoals(updatedGoals);
        setName('');
        setTargetAmount('');
        setTargetDate('');
    };

    useEffect(() => {
        const getGoalsAndForecasts = async () => {
            const goalsData = await fetchGoals();
            setGoals(goalsData);
            const forecastsData = await fetchForecasts();
            setForecasts(forecastsData);
        };

        getGoalsAndForecasts();
    }, [fetchGoals, fetchForecasts]);

    return (
        <div className="goal-container">
            <header className="goal-header">
                <h1>Goal Management</h1>
            </header>
            <form onSubmit={handleSubmit} className="goal-form">
                <div className="form-group2">
                    <label>Goal Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Target Amount</label>
                    <input
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group2">
                    <label>Target Date</label>
                    <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="add-goal-button">Add Goal</button>
            </form>

            <div className="goal-list-container">
                <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Your Goals</h2>
                <div className="goal-list">
                    {goals.map(goal => (
                        <div key={goal._id} className="goal-item">
                            <h3>{goal.name}</h3>
                            <p><strong>Target Amount:</strong> ${goal.targetAmount}</p>
                            <p><strong>Target Date:</strong> {new Date(goal.targetDate).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="forecast-list-container">
                <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Your Forecasts</h2>
                <div className="forecast-list">
                    {forecasts.map(forecast => (
                        <div key={forecast._id} className="forecast-item">
                            <h3>{forecast.name}</h3>
                            <p><strong>Target Amount:</strong> ${forecast.targetAmount}</p>
                            <p><strong>Current Amount:</strong> ${forecast.currentAmount}</p>
                            <p><strong>Monthly Income:</strong> ${forecast.monthlyIncome}</p>
                            <p><strong>Allocation Percentage:</strong> {forecast.allocationPercentage}%</p>
                            <p><strong>Months to Achieve Goal:</strong> {forecast.months}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GoalForm;
