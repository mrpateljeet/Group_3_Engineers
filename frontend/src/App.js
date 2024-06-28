import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Homepage from './components/HomePage';

// function Home() {
//   return (
//     <div className="container">
//       <h1>Budget Minder</h1>
//       <div className="links">
//         <Link to="/login">Login</Link>
//         <Link to="/register">Register</Link>
//       </div>
//     </div>
//   );
// }

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}

export default App;
