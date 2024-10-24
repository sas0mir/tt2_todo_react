import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://api.calmplete.net/api/InternalLogin', {
        email,
        password,
        state: 'Internal',
      });
      const token = response.data.access_token;
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
      </Box>
    </Container>
  );
};

export default Login;