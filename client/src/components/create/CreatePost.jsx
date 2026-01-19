import React, { useState, useEffect, useContext } from 'react';
import { styled, Box, TextareaAutosize, Button, InputBase, FormControl, Snackbar, Alert } from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
//media query
const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    }
}));
//design of publish button
const PrimaryButton = styled(Button)`
    text-transform: none;
    background: #03112B;
    color: #fff;
    height: 40px;
    border-radius: 2px;
    &:hover {
    background-color: #93AFC9;
    color:#03112B;
  }
`;
//css of banner of image
const Image = styled('img')({
    width: '100%',
    height: '50vh',
    objectFit: 'cover'
});
//utility that wraps an input component with 
//other associated components in order to make 
//the state of the input available to those components.
const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
`;
//It aims to be a simple building block for creating an input.
const InputTextField = styled(InputBase)`
    flex: 1;
    margin: 0 30px;
    font-size: 25px;
`;
const StyledTextArea = styled(TextareaAutosize)`
    width: 100%;
    border: none;
    margin-top: 50px;
    font-size: 18px;
    &:focus-visible {
        outline: none;
    }
`;

const TagsInput = styled(InputBase)`
    width: 100%;
    margin-top: 10px;
    font-size: 16px;
    padding: 12px 20px;
    border: 1px solid #d3cede;
    border-radius: 8px;
    background: #f9fbff;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    
    &:hover {
        border-color: #93AFC9;
        background: #fff;
    }
    
    &.Mui-focused {
        border-color: #03112B;
        box-shadow: 0 4px 12px rgba(3, 17, 43, 0.1);
        background: #fff;
    }
`;

const initialPost = {
    title: '',
    description: '',
    picture: '',
    username: '',
    categories: '',
    tags: [],
    createdDate: new Date()
}

const CreatePost = () => {
    const navigate = useNavigate();//perform navigation actions with better compability
    const location = useLocation();// returns a newly updated location object

    const [post, setPost] = useState(initialPost);
    const [tagString, setTagString] = useState('');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [type, setType] = useState('success');
    
    const { account } = useContext(DataContext);
    //image url
    const url = post.picture ? post.picture : 'https://cdn2.hubspot.net/hubfs/145335/blogging-for-business-heres-everything-you-need-to-know.jpg' ;
    
    useEffect(() => {
        setPost(prevPost => ({
            ...prevPost,
            categories: location.search?.split('=')[1] || 'All',
            username: account.username
        }));
    }, [location.search, account.username]);

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPost(prevPost => ({ ...prevPost, picture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const showToast = (message, severity = 'success') => {
        setError(message);
        setType(severity);
        setOpen(true);
    }

    const savePost = async () => {
        const tagsArray = tagString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const postToSave = { ...post, tags: tagsArray };
        let response = await API.createPost(postToSave);
        if (response.isSuccess) {
            navigate('/');
        } else {
            showToast(response.msg, 'error');
        }
    }

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    }

    return (
        <Container>
            <Image src={url} alt="post" />

            <StyledFormControl>
                <label htmlFor="fileInput">
                    <Add fontSize="large" color="action" />
                </label>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={(e) => onFileChange(e)}
                />
                <InputTextField onChange={(e) => handleChange(e)} name='title' placeholder="Title" />
                <PrimaryButton onClick={() => savePost()} variant="contained">PUBLISH</PrimaryButton>
            </StyledFormControl>

            <Box style={{ marginTop: 20 }}>
                <span style={{ fontSize: 14, color: '#878787', fontWeight: 600, marginLeft: 5 }}>Add Tags</span>
                <TagsInput 
                    onChange={(e) => setTagString(e.target.value)} 
                    name='tags' 
                    placeholder="Separate tags with commas (e.g. tech, react, node)" 
                />
            </Box>

            <StyledTextArea
                rowsMin={5}
                placeholder="Share your story..."
                name='description'
                onChange={(e) => handleChange(e)} 
            />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default CreatePost;