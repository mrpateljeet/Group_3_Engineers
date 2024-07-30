import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
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
            <h1 style={{ 
                fontWeight: 'bold', 
                color: 'black', 
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', 
                transition: 'transform 0.2s' 
                }}>
                Profile
            </h1>
            <header className="profile-header">
                <button className="back-button" onClick={handleBackToDashboard}>
                    <ArrowBackIcon />
                </button>
                <h1></h1>
                <IconButton color="secondary" onClick={handleLogout} className="icon-button">
                    <ExitToAppIcon />
                </IconButton>
            </header>
            <div className="profile-avatar">
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=007bff&color=fff`} alt="Avatar" />
            </div>
            <div className="profile-form">
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
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group2">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group2">
                                <label>Job:</label>
                                <input
                                    type="text"
                                    name="job"
                                    value={formData.job}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group2">
                                <label>Bio:</label>
                                <input
                                    type="text"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group2">
                                <label>Age:</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group2">
                                <label>Salary:</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group2">
                                <label>Account Balance:</label>
                                <input
                                    type="number"
                                    name="accountBalance"
                                    value={formData.accountBalance}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                            </div>
                            <button type="submit" className="btn btn-success save-profile-button">Save</button>
                            <button type="button" onClick={() => setEditMode(false)} className="btn btn-danger cancel-profile-button">Cancel</button>
                        </form>
                    ) : (
                        <>
                            <p><strong>Name:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Job:</strong> {user.job}</p>
                            <p><strong>Bio:</strong> {user.bio}</p>
                            <p><strong>Age:</strong> {user.age}</p>
                            <p><strong>Salary:</strong> {user.salary}</p>
                            <p><strong>Account Balance:</strong> {user.accountBalance}</p>
                            <button onClick={() => setEditMode(true)} className="btn btn-primary edit-profile-button">Edit</button>
                        </>
                    )
                )}
            </div>
        </div>
    );
};

export default Profile;
