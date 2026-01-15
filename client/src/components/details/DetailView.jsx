import { useState, useEffect, useContext } from 'react';
import { Box, Typography, styled } from '@mui/material';
import { Delete, Edit, ThumbUp, ThumbDown, ThumbUpAltOutlined, ThumbDownAltOutlined } from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
// components
import Comments from './comments/Comments';

const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    },
}));
const Image = styled('img')({
    width: '100%',
    height: '50vh',
    objectFit: 'cover'
});

const EditIcon = styled(Edit)`
    margin: 5px;
    padding: 5px;
    border:none;
    border-radius: 10px;
`;

const DeleteIcon = styled(Delete)`
    margin: 5px;
    padding: 5px;
    border: none;
    border-radius: 10px;
`;

const Heading = styled(Typography)`
    font-size: 38px;
    font-weight: 600;
    text-align: center;
    margin: 50px 0 10px 0;
`;

const Author = styled(Box)(({ theme }) => ({
    color: '#878787',
    display: 'flex',
    margin: '20px 0',
    [theme.breakpoints.down('sm')]: {
        display: 'block'
    },
}));

const DetailView = () => {
    const url = 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';
    
    const [post, setPost] = useState({});
    const { account } = useContext(DataContext);

    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
        const fetchData = async () => {
            let response = await API.getPostById(id);
            if (response.isSuccess) {
                setPost(response.data);
            }
        }
        fetchData();
    }, [id]);

    const deleteBlog = async () => {  
        await API.deletePost(post._id);
        navigate('/')
    }

    const toggleLike = async () => {
        let response = await API.likePost({ username: account.username, _id: post._id });
        if (response.isSuccess) {
            // Re-fetch post data to update counts and UI
            let updatedPost = await API.getPostById(id);
            if (updatedPost.isSuccess) setPost(updatedPost.data);
        }
    }

    const toggleDislike = async () => {
        let response = await API.dislikePost({ username: account.username, _id: post._id });
        if (response.isSuccess) {
            let updatedPost = await API.getPostById(id);
            if (updatedPost.isSuccess) setPost(updatedPost.data);
        }
    }

    return (
        <Container>
            <Image src={post.picture || url} alt="post" />
            <Box style={{ float: 'right' }}>
                {   
                    account.username === post.username && 
                    <>  
                        <Link to={`/update/${post._id}`}><EditIcon color="primary" /></Link>
                        <DeleteIcon onClick={() => deleteBlog()} color="error" />
                    </>
                }
            </Box>
            <Heading>{post.title}</Heading>

            <Author>
                <Link to={`/?username=${post.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography>Author: <span style={{fontWeight: 600}}>{post.username}</span></Typography>
                </Link>
                <Box style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Box style={{ display: 'flex', alignItems: 'center', marginRight: 20, cursor: 'pointer' }} onClick={() => toggleLike()}>
                        {
                            post.likes && post.likes.includes(account.username) ? 
                            <ThumbUp color="primary" fontSize="small" /> : 
                            <ThumbUpAltOutlined fontSize="small" />
                        }
                        <Typography style={{ marginLeft: 5 }}>{post.likes?.length || 0}</Typography>
                    </Box>
                    <Box style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleDislike()}>
                        {
                            post.dislikes && post.dislikes.includes(account.username) ? 
                            <ThumbDown color="error" fontSize="small" /> : 
                            <ThumbDownAltOutlined fontSize="small" />
                        }
                        <Typography style={{ marginLeft: 5 }}>{post.dislikes?.length || 0}</Typography>
                    </Box>
                    <Typography style={{ marginLeft: 30 }}>{new Date(post.createdDate).toDateString()}</Typography>
                </Box>
            </Author>

            <Typography>{post.description}</Typography>
            <Comments post={post} />
        </Container>
    )
}

export default DetailView;