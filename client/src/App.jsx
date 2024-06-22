import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleSignup = async () => {
    try {
      await axios.post('http://localhost:5000/signup', { username, password });
      console.log('User registered successfully');
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      setToken(response.data.token);
      console.log('Login successful');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const handleProtectedRoute = async () => {
    try {
      const response = await axios.get('http://localhost:5000/protected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error accessing protected route:', error.message);
    }
  };

  return (
    <div>
      <h1>MERN Auth with JWT Authentication</h1>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleProtectedRoute}>Protected Route</button>
    </div>
  );
}

export default App;

