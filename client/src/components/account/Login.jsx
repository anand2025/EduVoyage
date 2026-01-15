import React, { useState, useEffect, useContext } from 'react';
import img from './logo.png';

import { TextField, Box, Button, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
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
    line-height: 0;
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

    const navigate = useNavigate();
    const { setAccount } = useContext(DataContext);
    useEffect(() => {
        showError(false);
    }, [login])

    const onValueChange = (e) => {
        setLogin({ ...login, [e.target.name]: e.target.value });
    }

    const onInputChange = (e) => {
        setSignup({ ...signup, [e.target.name]: e.target.value });
    }

    const loginUser = async () => {
        let response = await API.userLogin(login);
        if (response.isSuccess) {
            showError('');

            sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
            sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
            setAccount({ name: response.data.name, username: response.data.username });
            
            isUserAuthenticated(true)
            setLogin(loginInitialValues);
            navigate('/');
        } else {
            showError('Something went wrong! Please try again later');
        }
    }

    const signupUser = async () => {
        let response = await API.userSignup(signup);
        if (response.isSuccess) {
            showError('');
            setSignup(signupInitialValues);
            toggleAccount('login');
        } else {
            showError('Something went wrong! Please try again later');
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
                            <TextField variant="standard" value={login.username} onChange={(e) => onValueChange(e)} name='username' label='Enter Username' />
                            <TextField variant="standard" value={login.password} onChange={(e) => onValueChange(e)} name='password' label='Enter Password' />

                            {error && <Error>{error}</Error>}

                            <PrimaryButton variant="contained" onClick={() => loginUser()} >Login</PrimaryButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <SecondaryButton onClick={() => toggleSignup()} style={{ marginBottom: 50 }}>Create an account</SecondaryButton>
                        </Wrapper> :
                        //If url is equal to signup then this part is displayed
                        <Wrapper>
                            <TextField variant="standard" onChange={(e) => onInputChange(e)} name='name' label='Enter Name' />
                            <TextField variant="standard" onChange={(e) => onInputChange(e)} name='username' label='Enter Username' />
                            <TextField variant="standard" onChange={(e) => onInputChange(e)} name='password' label='Enter Password' />

                            <PrimaryButton variant="contained" onClick={() => signupUser()} >Signup</PrimaryButton>
                            <Text style={{ textAlign: 'center' }}>OR</Text>
                            <SecondaryButton  onClick={() => toggleSignup()}>Already have an account</SecondaryButton>
                        </Wrapper>
                }
            </Box>
        </Component>
        </>
    )
}

export default Login;