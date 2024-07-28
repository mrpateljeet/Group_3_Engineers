import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './ProfilePage.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }
                const data = await response.json();
                setUser(data);
                setFormData(data); // Initialize form data with user data
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to update user profile');
            }
            const updatedData = await response.json();
            setUser(updatedData);
            setEditMode(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login', { replace: true });
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="profile-container">
            <header className="profile-header">
                <button className="back-button" onClick={handleBackToDashboard}>
                    &larr;
                </button>
                <h1>Profile</h1>
                <IconButton color="secondary" onClick={handleLogout} style={{ position: 'absolute', right: 16 }}>
                    <ExitToAppIcon />
                </IconButton>
            </header>
            <div className="profile-form">
                <h1>Profile</h1>
                {user && (
                    editMode ? (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group2">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group2">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group2">
                                <label>Job:</label>
                                <input
                                    type="text"
                                    name="job"
                                    value={formData.job}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group2">
                                <label>Bio:</label>
                                <input
                                    type="text"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group2">
                                <label>Age:</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group2">
                                <label>Salary:</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group2">
                                <label>Account Balance:</label>
                                <input
                                    type="number"
                                    name="accountBalance"
                                    value={formData.accountBalance}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit" className="save-profile-button">Save</button>
                            <button type="button" onClick={() => setEditMode(false)} className="cancel-profile-button">Cancel</button>
                        </form>
                    ) : (
                        <>
                            <p>Name: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>Job: {user.job}</p>
                            <p>Bio: {user.bio}</p>
                            <p>Age: {user.age}</p>
                            <p>Salary: {user.salary}</p>
                            <p>Account Balance: {user.accountBalance}</p>
                            <button onClick={() => setEditMode(true)} className="edit-profile-button">Edit</button>
                        </>
                    )
                )}
            </div>
        </div>
    );
};

export default Profile;
