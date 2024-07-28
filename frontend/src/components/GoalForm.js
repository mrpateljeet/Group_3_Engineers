import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GoalForm.css';
import { VictoryChart, VictoryLine, VictoryAxis } from 'victory';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const GoalForm = ({ onAdd, fetchGoals, fetchForecasts }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [goals, setGoals] = useState([]);
    const [forecasts, setForecasts] = useState([]);
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login', { replace: true });
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const renderForecastChart = (forecast) => {
        const data = [
            { x: 'Target Amount', y: parseFloat(forecast.targetAmount) || 0 },
            { x: 'Current Amount', y: parseFloat(forecast.currentAmount) || 0 },
            { x: 'Monthly Income', y: parseFloat(forecast.monthlyIncome) || 0 },
        ];

        return (
            <div>
                <VictoryChart
                    domainPadding={{ x: 50, y: 30 }}
                    padding={{ left: 80, right: 80, top: 30, bottom: 50 }}
                    width={600}
                    height={300}
                >
                    <VictoryLine
                        data={data}
                        x="x"
                        y="y"
                        style={{
                            data: { stroke: "#2196F3" },
                            labels: { fontSize: 12, fontWeight: 'bold' }
                        }}
                    />
                    <VictoryAxis
                        style={{ tickLabels: { fontSize: 12, padding: 5, fontWeight: 'bold' } }}
                    />
                    <VictoryAxis
                        dependentAxis
                        style={{ tickLabels: { fontSize: 12, padding: 5, fontWeight: 'bold' } }}
                    />
                </VictoryChart>
            </div>
        );
    };

    const renderMonthsToAchieveChart = () => {
        const data = forecasts.map(forecast => ({
            x: forecast.name,
            y: parseFloat(forecast.months) || 0
        }));

        return (
            <div>
                <VictoryChart
                    domainPadding={{ x: 50, y: 30 }}
                    padding={{ left: 80, right: 80, top: 30, bottom: 50 }}
                    width={600}
                    height={300}
                >
                    <VictoryAxis
                        style={{ tickLabels: { fontSize: 12, padding: 5, fontWeight: 'bold' } }}
                    />
                    <VictoryAxis
                        dependentAxis
                        style={{ tickLabels: { fontSize: 12, padding: 5, fontWeight: 'bold' } }}
                    />
                    <VictoryLine
                        data={data}
                        x="x"
                        y="y"
                        style={{
                            data: { stroke: "#FF5722" },
                            labels: { fontSize: 12, fontWeight: 'bold' }
                        }}
                    />
                </VictoryChart>
            </div>
        );
    };

    return (
        <div className="goal-container">
            <header className="goal-header">
                <button className="back-button" onClick={handleBackToDashboard}>
                    &larr;
                </button>
                <h1>Goal Management</h1>
                <IconButton color="secondary" onClick={handleLogout} style={{ position: 'absolute', right: 16 }}>
                    <ExitToAppIcon />
                </IconButton>
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
                    <table className="goal-table">
                        <thead>
                            <tr>
                                <th>Goal Name</th>
                                <th>Target Amount</th>
                                <th>Target Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {goals.map(goal => (
                                <tr key={goal._id}>
                                    <td>{goal.name}</td>
                                    <td>${goal.targetAmount}</td>
                                    <td>{new Date(goal.targetDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="forecast-list-container">
                <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Your Forecasts</h2>
                <div className="forecast-list">
                    {forecasts.map(forecast => (
                        <div key={forecast._id} className="forecast-item">
                            <div className="forecast-details">
                                <h3>{forecast.name}</h3>
                                <p><strong>Target Amount:</strong> ${forecast.targetAmount}</p>
                                <p><strong>Current Amount:</strong> ${forecast.currentAmount}</p>
                                <p><strong>Monthly Income:</strong> ${forecast.monthlyIncome}</p>
                                <p><strong>Allocation Percentage:</strong> {forecast.allocationPercentage}%</p>
                                <p><strong>Months to Achieve Goal:</strong> {forecast.months}</p>
                            </div>
                            <div className="forecast-chart">
                                {renderForecastChart(forecast)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="months-to-achieve-container">
                <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>Months to Achieve Goal</h2>
                <div className="months-to-achieve-list">
                    {renderMonthsToAchieveChart()}
                </div>
            </div>
        </div>
    );
};

export default GoalForm;
