import React, { useState } from 'react';
import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box, Link } from '@mui/material';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://api.calmplete.net/api/InternalLogin/sign-up', {
        username,
        email,
        password,
      });
      console.log(response.data);
      // После успешной регистрации можно редиректить на страницу логина или ToDo
      navigate('/login'); 
    } catch (err: any) {
        console.log('ERR->', err);
      setError(`Error during registration.
      ${err?.response ? err?.response.data : ''}
        Try again.`);
    }
  };

  return (
    <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Typography variant="h4" gutterBottom>
            Sign Up
        </Typography>
        <form onSubmit={handleSignUp}>
            <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            />
            <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            />
            <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            />
            {error && <Typography color="error">{error}</Typography>}
            <Button type="submit" variant="contained" color="primary" className='login-sbmt-btn'>
                Sign Up
            </Button>
        </form>
        <Link href="/login" underline="hover" className='login-link'>Have account</Link>
        </Box>
    </Container>
  );
};

export default SignUp;