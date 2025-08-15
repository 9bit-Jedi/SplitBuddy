import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import {
  Card,
  Link,
  Container,
  Typography,
  Stack,
  Box,
  TextField,
  Button,
  Grid,
} from '@mui/material';

// hooks
import useResponsive from '../../theme/hooks/useResponsive';
import Logo from '../Logo';
import AlertBanner from '../AlertBanner';
import Copyright from '../Copyright';

// services
import { loginService } from '../../services/auth';

import configData from '../../config.json';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function Login() {
  const navigate = useNavigate();
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  //Function to check if the user is already logged in - check localStorage
  const user = JSON.parse(localStorage.getItem('profile'));
  //If user logged in the page is auto directed to dashboard
  if (user) {
    user.accessToken && (window.location.href = configData.DASHBOARD_URL);
  }

  useEffect(() => {
    const profile = localStorage.getItem('profile');
    if (profile) {
      navigate('/dashboard/app');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginService(formData, setAlert, setAlertMessage);
    if (response?.data.access) {
      navigate('/dashboard/app');
    }
  };

  return (
    <>
      <RootStyle>
        <HeaderStyle>
          <Box />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Don't have an account? {''}
              <Link variant="subtitle2" component={RouterLink} to="/register">
                Get started
              </Link>
            </Typography>
          )}
        </HeaderStyle>
        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <img
              src="/static/illustrations/illustration_login.png"
              alt="login"
            />
          </SectionStyle>
        )}
        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Sign in to SplitApp!
            </Typography>

            <Typography sx={{ color: 'text.secondary', mb: 5 }}>
              Enter your details below.
            </Typography>

            {/* <AuthSocial /> */}

            {alert && <AlertBanner severity="error" message={alertMessage} />}
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/register" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don't have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to="/register">
                  Get started
                </Link>
              </Typography>
            )}
            <Stack spacing={3} sx={{ mt: 5 }}>
              <Copyright />
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
    </>
  );
}
