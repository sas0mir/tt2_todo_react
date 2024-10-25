import React, { useState } from 'react';
import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, Link } from '@mui/material';
import { useDispatch, UseDispatch } from 'react-redux';
import { login } from '../slices/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://api.calmplete.net/api/InternalLogin', {
        username,
        password,
        state: 'Internal',
      });
      const token = response.data.accessToken;
      dispatch(login({
        username,
        token
      }));
      localStorage.setItem('token', token); // сохраняем токен в localStorage
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // добавляем токен в заголовки axios
      navigate('/tasks'); // перенаправляем на страницу с задачами
    } catch (err) {
      setError('Invalid login credentials');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Typography variant="h4" gutterBottom>Login</Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" onClick={handleLogin} className='login-sbmt-btn'>Login</Button>
        <Link href="/signup" underline="hover" className='login-link'>Sign up</Link>
      </Box>
    </Container>
  );
};

export default Login;