import React, { useState, useEffect } from 'react';
import { Box, styled, TextareaAutosize, Button, FormControl, InputBase, Snackbar, Alert } from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

import { API } from '../../service/api';

const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    }
}));
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
const Image = styled('img')({
    width: '100%',
    height: '50vh',
    objectFit: 'cover'
});

const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
`;

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
    username: 'user',
    categories: 'Technology',
    tags: [],
    createdDate: new Date()
}

const Update = () => {
    const navigate = useNavigate();

    const [post, setPost] = useState(initialPost);
    const [tagString, setTagString] = useState('');
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [type, setType] = useState('success');

    const { id } = useParams();//access the parameters of the current route

    const url = 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';
    
    useEffect(() => {
        const fetchData = async () => {
            let response = await API.getPostById(id);
            if (response.isSuccess) {
                setPost(response.data);
                if (response.data.tags) {
                    setTagString(response.data.tags.join(', '));
                }
            }
        }
        fetchData();
    }, [id]);

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

    const updateBlogPost = async () => {
        const tagsArray = tagString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const postToUpdate = { ...post, tags: tagsArray };
        let response = await API.updatePost(postToUpdate);
        if (response.isSuccess) {
            navigate(`/details/${id}`);
        } else {
            showToast(response.msg, 'error');
        }
    }

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    }

    return (
        <Container>
            <Image src={post.picture || url} alt="post" />

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
                <InputTextField onChange={(e) => handleChange(e)} value={post.title} name='title' placeholder="Title" />
                <PrimaryButton onClick={() => updateBlogPost()} variant="contained">UPDATE</PrimaryButton>
            </StyledFormControl>

            <Box style={{ marginTop: 20 }}>
                <span style={{ fontSize: 14, color: '#878787', fontWeight: 600, marginLeft: 5 }}>Edit Tags</span>
                <TagsInput 
                    onChange={(e) => setTagString(e.target.value)} 
                    name='tags' 
                    value={tagString}
                    placeholder="Separate tags with commas (e.g. tech, react, node)" 
                />
            </Box>

            <StyledTextArea
                rowsMin={5}
                placeholder="Share your story..."
                name='description'
                onChange={(e) => handleChange(e)} 
                value={post.description}
            />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default Update;