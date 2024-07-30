import React, { useState } from 'react';
import axios from 'axios';
import './FeedbackForm.css';

const FeedbackForm = () => {
    const [rating, setRating] = useState(1);
    const [comments, setComments] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert('User is not authenticated');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/api/feedback', { rating, comments }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error submitting feedback:', error.response ? error.response.data : error.message);
            alert('Failed to submit feedback. Please check the console for more details.');
        }
    };

    return (
        <div className="feedback-form-container">
            <h2>Submit Your Feedback</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Rating:
                    <select value={rating} onChange={(e) => setRating(e.target.value)}>
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </label>
                <label>
                    Comments:
                    <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
                </label>
                <button type="submit">Submit Feedback</button>
            </form>
        </div>
    );
};

export default FeedbackForm;
