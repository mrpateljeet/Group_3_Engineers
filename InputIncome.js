// src/components/InputIncome.js
import React, { useState } from 'react';
import axios from 'axios';

const InputIncome = () => {
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/income', { amount, frequency });
      setMessage('Income added successfully');
    } catch (error) {
      setMessage('Error adding income');
    }
  };

  return (
    <div>
      <h2>Input Income</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Frequency:</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <button type="submit">Add Income</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default InputIncome;
