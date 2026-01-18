import React, { useState, useEffect, useContext } from 'react';
import img from './logo.png';

import { TextField, Box, Button, Typography, styled, IconButton, InputAdornment, Snackbar, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
import { setAccessToken, setRefreshToken } from '../../utils/common-utils';
//Styling
const Banner = styled('img')({
    width: '45%',
    display: 'flex',
    alignItems:'center',
    margin: '0 auto',
    padding: '0 5px 5px 5px',
});
const Component = styled(Box)`
    width: 400px;
    margin: auto;
    box-shadow: 5px 5px 5px 5px rgb(0 0 0/ 0.6);
`;

const Wrapper = styled(Box)`
    padding: 25px 35px;
    display: flex;
    flex: 1;
    overflow: auto;
    flex-direction: column;
    & > div, & > button, & > p {
        margin-top: 20px;
    }
`;

const PrimaryButton = styled(Button)`
    text-transform: none;
    background: #03112B;
    color: #fff;
    height: 48px;
    border-radius: 2px;
    &:hover {
    background-color: #93AFC9;
    color:#03112B;
  }
`;

const SecondaryButton = styled(Button)`
    text-transform: none;
    background: #fff;
    color: #03112B;
    height: 48px;
    border-radius: 2px;
    box-shadow: 2px 2px 4px 4px rgb(0 0 0 / 20%);
    &:hover {
    background-color: #93AFC9;
    color:#03112B;
  }
`;

const Text = styled(Typography)`
    color: #878787;
    font-size: 12px;
`;

const Error = styled(Typography)`
    font-size: 10px;
    color: #ff6161;
    line-height: 1.5;
    margin-top: 10px;
    font-weight: 600;
`

const loginInitialValues = {
    username: '',
    password: ''
};

const signupInitialValues = {
    name: '',
    username: '',
    password: '',
};
//useState allows to add state to a functional component
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
            navigate('/');
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
        // Minimum 8 characters, at least one letter, one number and one special character
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
        <Banner src={img} alt="blog" />
        <Component>
            <Box>
                {
                    //If url is equal to login then this part is displayed
                    account === 'login' ?
                        <Wrapper>
                            <TextField variant="standard" value={login.username} onChange={(e) => onValueChange(e)} name='username' label='Username' InputLabelProps={{ shrink: true }} />
                            <TextField 
                                variant="standard" 
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

                            <PrimaryButton variant="contained" onClick={() => loginUser()} >Login</PrimaryButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <SecondaryButton onClick={() => toggleSignup()} style={{ marginBottom: 50 }}>Create an account</SecondaryButton>
                        </Wrapper> :
                        //If url is equal to signup then this part is displayed
                        <Wrapper>
                            <TextField variant="standard" value={signup.name} onChange={(e) => onInputChange(e)} name='name' label='Name' InputLabelProps={{ shrink: true }} />
                            <TextField variant="standard" value={signup.username} onChange={(e) => onInputChange(e)} name='username' label='Username' InputLabelProps={{ shrink: true }} />
                            <TextField 
                                variant="standard" 
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

                            <PrimaryButton variant="contained" onClick={() => signupUser()} >Signup</PrimaryButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <SecondaryButton  onClick={() => toggleSignup()}>Already have an account</SecondaryButton>
                        </Wrapper>
                }
            </Box>
        </Component>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
                {alertMessage}
            </Alert>
        </Snackbar>
        </>
    )
}

export default Login;