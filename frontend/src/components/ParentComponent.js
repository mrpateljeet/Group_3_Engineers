// ParentComponent.js
import React from 'react';
import ForecastForm from './ForecastForm';

const ParentComponent = () => {
    const onForecast = async (forecastData) => {
        // Simulate a forecast result
        const result = { months: Math.ceil(forecastData.targetAmount / (forecastData.monthlyIncome * (forecastData.allocationPercentage / 100))) };
        return result;
    };

    const saveForecast = async (forecastData) => {
        try {
            const response = await fetch('http://localhost:3000/api/forecasts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(forecastData)
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error saving forecast:', error);
        }
    };

    return (
        <div>
            <ForecastForm onForecast={onForecast} saveForecast={saveForecast} />
        </div>
    );
};

export default ParentComponent;
