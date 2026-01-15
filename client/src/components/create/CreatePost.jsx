import React, { useState, useEffect, useContext } from 'react';
import { styled, Box, TextareaAutosize, Button, InputBase, FormControl} from '@mui/material';
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
//a textarea HTML element that automatically adjusts its height
// to match the length of the content within.
const Textarea = styled(TextareaAutosize)`
    width: 100%;
    border: none;
    margin-top: 50px;
    font-size: 18px;
    &:focus-visible {
        outline: none;
    }
`;

const initialPost = {
    title: '',
    description: '',
    picture: '',
    username: '',
    categories: '',
    createdDate: new Date()
}

const CreatePost = () => {
    const navigate = useNavigate();//perform navigation actions with better compability
    const location = useLocation();// returns a newly updated location object

    const [post, setPost] = useState(initialPost);
    const [file, setFile] = useState('');
    const { account } = useContext(DataContext);
    //image url
    const url = post.picture ? post.picture : 'https://cdn2.hubspot.net/hubfs/145335/blogging-for-business-heres-everything-you-need-to-know.jpg' ;
    
    useEffect(() => {
        const getImage = async () => { 
            if(file) {
                const data = new FormData();
                data.append("name", file.name);
                data.append("file", file);
                
                const response = await API.uploadFile(data);
                setPost(prevPost => ({ ...prevPost, picture: response.data }));
            }
        }
        getImage();
        setPost(prevPost => ({
            ...prevPost,
            categories: location.search?.split('=')[1] || 'All',
            username: account.username
        }));
    }, [file, location.search, account.username]);

    const savePost = async () => {
        await API.createPost(post);
        navigate('/');
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
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <InputTextField onChange={(e) => handleChange(e)} name='title' placeholder="Title" />
                <PrimaryButton onClick={() => savePost()} variant="contained">PUBLISH</PrimaryButton>
            </StyledFormControl>

            <Textarea
                rowsMin={5}
                placeholder="Share your story..."
                name='description'
                onChange={(e) => handleChange(e)} 
            />
        </Container>
    )
}

export default CreatePost;