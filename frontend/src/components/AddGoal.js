import React from 'react';
import GoalForm from './GoalForm';
import { useNavigate } from 'react-router-dom';

const AddGoal = ({ onAdd, fetchGoals }) => {
    const navigate = useNavigate();

    const handleAddGoal = async (goal) => {
        await onAdd(goal);
        fetchGoals();
        navigate('/dashboard');
    };

    return (
        <div>
            <h1>Add Goal</h1>
            <GoalForm onAdd={handleAddGoal} />
        </div>
    );
};

export default AddGoal;
