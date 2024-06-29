import React from 'react';
import { Routes, Route} from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Homepage from './components/HomePage';
import Dashboard from './components/Dashboard';
import CompleteProfile from './components/CompleteProfile';
import ProfilePage from './components/ProfilePage';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/profile" element={<ProfilePage />} />
      
    </Routes>
  );
}

export default App;
