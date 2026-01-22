import React, { useState, useEffect, useContext } from 'react';
import loginBg from '../../assets/images/login-bg.png';

import { TextField, Box, Button, Typography, styled, IconButton, InputAdornment, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
import { setAccessToken, setRefreshToken } from '../../utils/common-utils';

// Main container with split layout
const Container = styled(Box)`
    display: flex;
    min-height: 100vh;
    width: 100%;
    
    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

// Left side - Image section
const ImageSection = styled(Box)`
    flex: 1;
    background-image: linear-gradient(
        rgba(3, 17, 43, 0.6),
        rgba(3, 17, 43, 0.7)
    ), url(${loginBg});
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    position: relative;
    
    @media (max-width: 768px) {
        min-height: 250px;
        flex: 0 0 auto;
    }
    
    @media (min-width: 769px) and (max-width: 1023px) {
        flex: 0 0 40%;
    }
`;

const BrandingContent = styled(Box)`
    text-align: center;
    color: white;
    z-index: 1;
`;

const BrandTitle = styled(Typography)`
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 10px;
    
    @media (max-width: 768px) {
        font-size: 1.8rem;
    }
`;

const BrandSubtitle = styled(Typography)`
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 300;
    
    @media (max-width: 768px) {
        font-size: 0.95rem;
    }
`;

// Right side - Form section
const FormSection = styled(Box)`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    
    @media (min-width: 769px) and (max-width: 1023px) {
        flex: 0 0 60%;
    }
    
    @media (max-width: 768px) {
        padding: 30px 20px;
    }
`;

const FormWrapper = styled(Box)`
    width: 100%;
    max-width: 450px;
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
    }
    
    @media (max-width: 768px) {
        padding: 30px 25px;
        max-width: 100%;
    }
`;

const FormTitle = styled(Typography)`
    font-size: 2rem;
    font-weight: 700;
    color: #03112B;
    margin-bottom: 10px;
    text-align: center;
    
    @media (max-width: 768px) {
        font-size: 1.6rem;
    }
`;

const FormSubtitle = styled(Typography)`
    font-size: 0.95rem;
    color: #666;
    margin-bottom: 30px;
    text-align: center;
`;

const StyledTextField = styled(TextField)`
    margin-bottom: 20px;
    
    & .MuiInputLabel-root {
        color: #666;
    }
    
    & .MuiInput-underline:before {
        border-bottom-color: #ddd;
    }
    
    & .MuiInput-underline:hover:not(.Mui-disabled):before {
        border-bottom-color: #93AFC9;
    }
    
    & .MuiInput-underline:after {
        border-bottom-color: #03112B;
    }
`;

const PrimaryButton = styled(Button)`
    text-transform: none;
    background: #03112B;
    color: #fff;
    height: 50px;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    margin-top: 10px;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #93AFC9;
        color: #03112B;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(3, 17, 43, 0.3);
    }
`;

const SecondaryButton = styled(Button)`
    text-transform: none;
    background: transparent;
    color: #03112B;
    height: 50px;
    border-radius: 8px;
    border: 2px solid #03112B;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #03112B;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(3, 17, 43, 0.2);
    }
`;

const Divider = styled(Box)`
    display: flex;
    align-items: center;
    margin: 25px 0;
    
    &::before,
    &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid #ddd;
    }
`;

const DividerText = styled(Typography)`
    color: #878787;
    font-size: 0.85rem;
    padding: 0 15px;
    font-weight: 500;
`;

const Error = styled(Typography)`
    font-size: 0.85rem;
    color: #ff6161;
    line-height: 1.5;
    margin-top: -10px;
    margin-bottom: 10px;
    font-weight: 600;
    text-align: center;
`;

const loginInitialValues = {
    username: '',
    password: ''
};

const signupInitialValues = {
    name: '',
    username: '',
    password: '',
};

const Login = ({ isUserAuthenticated }) => {
    const [login, setLogin] = useState(loginInitialValues);
    const [signup, setSignup] = useState(signupInitialValues);
    const [error, showError] = useState('');
    const [account, toggleAccount] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('error');

    const navigate = useNavigate();
    const location = useLocation();
    const { setAccount } = useContext(DataContext);

    useEffect(() => {
        showError(false);
    }, [login])

    useEffect(() => {
        if (sessionStorage.getItem('accessToken')) {
            navigate('/');
        }
    }, [navigate])

    const onValueChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }

    const onInputChange = (e) => {
        setSignup({ ...signup, [e.target.name]: e.target.value });
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const showMessage = (msg, type = 'error') => {
        setAlertMessage(msg);
        setAlertType(type);
        setOpen(true);
        if (type === 'error') showError(msg);
    }

    const loginUser = async () => {
        if (!login.username || !login.password) {
            showMessage('Please fill in all fields.');
            return;
        }
        let response = await API.userLogin(login);
        if (response.isSuccess) {
            showError('');

            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            sessionStorage.setItem('name', response.data.name);
            sessionStorage.setItem('username', response.data.username);
            
            setAccount({ name: response.data.name, username: response.data.username });
            
            isUserAuthenticated(true)
            setLogin(loginInitialValues);
            const redirectPath = location.state?.from?.pathname || '/';
            navigate(redirectPath);
        } else {
            showMessage(response.msg || 'Invalid username or password');
        }
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return regex.test(password);
    }

    const signupUser = async () => {
        if (!signup.name || !signup.username || !signup.password) {
            showMessage('Please fill in all fields.');
            return;
        }
        if (!validatePassword(signup.password)) {
            showMessage('Password must be at least 8 characters long and include at least one letter, one number, and one special character.');
            return;
        }
        let response = await API.userSignup(signup);
        if (response.isSuccess) {
            showError('');
            setSignup(signupInitialValues);
            showMessage('Signup successful!', 'success');
            setTimeout(() => {
                toggleAccount('login');
            }, 1000);
        } else {
            showMessage(response.msg || 'Something went wrong! Please try again later');
        }
    }

    const toggleSignup = () => {
        account === 'signup' ? toggleAccount('login') : toggleAccount('signup');
    }

    return (
        <>
            <Container>
                {/* Left Side - Image Section */}
                <ImageSection>
                    <BrandingContent>
                        <BrandTitle>EduVoyage</BrandTitle>
                        <BrandSubtitle>Your Journey to Knowledge Begins Here</BrandSubtitle>
                    </BrandingContent>
                </ImageSection>

                {/* Right Side - Form Section */}
                <FormSection>
                    <FormWrapper>
                        {account === 'login' ? (
                            <>
                                <FormTitle>Welcome Back</FormTitle>
                                <FormSubtitle>Login to continue your learning journey</FormSubtitle>
                                
                                <StyledTextField 
                                    variant="standard" 
                                    fullWidth
                                    value={login.username} 
                                    onChange={(e) => onValueChange(e)} 
                                    name='username' 
                                    label='Username' 
                                    InputLabelProps={{ shrink: true }} 
                                />
                                
                                <StyledTextField 
                                    variant="standard" 
                                    fullWidth
                                    value={login.password} 
                                    onChange={(e) => onValueChange(e)} 
                                    name='password' 
                                    label='Password' 
                                    type={showPassword ? 'text' : 'password'}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {error && <Error>{error}</Error>}

                                <PrimaryButton 
                                    variant="contained" 
                                    fullWidth
                                    onClick={() => loginUser()}
                                >
                                    Login
                                </PrimaryButton>
                                
                                <Divider>
                                    <DividerText>OR</DividerText>
                                </Divider>
                                
                                <SecondaryButton 
                                    fullWidth
                                    onClick={() => toggleSignup()}
                                >
                                    Create an account
                                </SecondaryButton>
                            </>
                        ) : (
                            <>
                                <FormTitle>Create Account</FormTitle>
                                <FormSubtitle>Join EduVoyage and start learning today</FormSubtitle>
                                
                                <StyledTextField 
                                    variant="standard" 
                                    fullWidth
                                    value={signup.name} 
                                    onChange={(e) => onInputChange(e)} 
                                    name='name' 
                                    label='Name' 
                                    InputLabelProps={{ shrink: true }} 
                                />
                                
                                <StyledTextField 
                                    variant="standard" 
                                    fullWidth
                                    value={signup.username} 
                                    onChange={(e) => onInputChange(e)} 
                                    name='username' 
                                    label='Username' 
                                    InputLabelProps={{ shrink: true }} 
                                />
                                
                                <StyledTextField 
                                    variant="standard" 
                                    fullWidth
                                    value={signup.password}
                                    onChange={(e) => onInputChange(e)} 
                                    name='password' 
                                    label='Password' 
                                    type={showPassword ? 'text' : 'password'}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                {error && <Error>{error}</Error>}

                                <PrimaryButton 
                                    variant="contained" 
                                    fullWidth
                                    onClick={() => signupUser()}
                                >
                                    Sign Up
                                </PrimaryButton>
                                
                                <Divider>
                                    <DividerText>OR</DividerText>
                                </Divider>
                                
                                <SecondaryButton 
                                    fullWidth
                                    onClick={() => toggleSignup()}
                                >
                                    Already have an account
                                </SecondaryButton>
                            </>
                        )}
                    </FormWrapper>
                </FormSection>
            </Container>

            <Snackbar 
                open={open} 
                autoHideDuration={6000} 
                onClose={handleClose} 
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Login;