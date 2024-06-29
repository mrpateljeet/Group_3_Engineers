import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                console.log('Fetched User Data:', data);  // Log the fetched data
                setUser(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Profile</h1>
            {user && (
                <>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Job: {user.job}</p>
                    <p>Bio: {user.bio}</p>
                    <p>Age: {user.age}</p>
                    <p>Salary: {user.salary}</p>
                    <Link to="/dashboard">Back to Dashboard</Link>
                </>
            )}
        </div>
    );
};

export default Profile;
