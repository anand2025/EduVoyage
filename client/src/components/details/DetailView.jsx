import { useState, useEffect, useContext } from 'react';
import { Box, Typography, styled, Snackbar, Alert, Chip, Menu, MenuItem, ListItemIcon, ListItemText, Tooltip, Zoom } from '@mui/material';
import { Delete, Edit, ThumbUp, ThumbDown, ThumbUpAltOutlined, ThumbDownAltOutlined, Bookmark, BookmarkBorder, VolumeUp, Stop, IosShare, Link as LinkIcon, LinkedIn, Twitter } from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
import { formatDate } from '../../utils/common-utils';
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
    const [isSaved, setIsSaved] = useState(false);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [type, setType] = useState('success');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    
    const { account } = useContext(DataContext);

    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
        const fetchData = async () => {
            let response = await API.getPostById(id);
            if (response.isSuccess) {
                setPost(response.data);
            } else {
                showToast(response.msg, 'error');
            }
        }
        const fetchSavedStatus = async () => {
            if (!account.username) return;
            let response = await API.getSavedPosts(account.username);
            if (response.isSuccess) {
                setIsSaved(response.data.includes(id));
            }
        }
        fetchData();
        fetchSavedStatus();

        return () => {
            window.speechSynthesis.cancel();
        };
    }, [id, account.username]);

    const toggleListen = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            if (!post.title || !post.description) return;

            const text = `${post.title}. ${post.description}`;
            const utterance = new SpeechSynthesisUtterance(text);
            
            utterance.onend = () => {
                setIsSpeaking(false);
            };

            utterance.onerror = (event) => {
                console.error('SpeechSynthesisUtterance error', event);
                setIsSpeaking(false);
            };

            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
        }
    };

    const showToast = (message, severity = 'success') => {
        setError(message);
        setType(severity);
        setOpen(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const deleteBlog = async () => {  
        let response = await API.deletePost(post._id);
        if (response.isSuccess) {
            navigate('/');
        } else {
            showToast(response.msg, 'error');
        }
    }

    const toggleLike = async () => {
        let response = await API.likePost({ username: account.username, _id: post._id });
        if (response.isSuccess) {
            // Re-fetch post data to update counts and UI
            let updatedPost = await API.getPostById(id);
            if (updatedPost.isSuccess) setPost(updatedPost.data);
        } else {
            showToast(response.msg, 'error');
        }
    }

    const toggleDislike = async () => {
        let response = await API.dislikePost({ username: account.username, _id: post._id });
        if (response.isSuccess) {
            let updatedPost = await API.getPostById(id);
            if (updatedPost.isSuccess) setPost(updatedPost.data);
        } else {
            showToast(response.msg, 'error');
        }
    }

    const toggleSave = async () => {
        let response = await API.savePost({ username: account.username, postId: post._id });
        if (response.isSuccess) {
            setIsSaved(!isSaved);
            showToast(response.data.msg);
        } else {
            showToast(response.msg, 'error');
        }
    }

    const sharePost = (platform) => {
        const url = window.location.href;
        const text = `Check out this blog post: ${post.title}`;

        switch (platform) {
            case 'copy':
                navigator.clipboard.writeText(url);
                showToast('Link copied to clipboard!');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                break;
            default:
                break;
        }
        handleMenuClose();
    }

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Container>
            <Image src={post.picture || url} alt="post" />
            <Box style={{ float: 'right', display: 'flex', alignItems: 'center' }}>
                <Tooltip title={isSpeaking ? "Stop" : "Listen"} arrow TransitionComponent={Zoom}>
                    <Box onClick={toggleListen} style={{ cursor: 'pointer', marginRight: 10 }}>
                        {isSpeaking ? <Stop color="error" /> : <VolumeUp color="primary" />}
                    </Box>
                </Tooltip>
                {   
                    account.username === post.username && 
                    <>  
                        <Tooltip title="Edit" arrow TransitionComponent={Zoom}>
                            <Link to={`/update/${post._id}`}><EditIcon color="primary" /></Link>
                        </Tooltip>
                        <Tooltip title="Delete" arrow TransitionComponent={Zoom}>
                            <DeleteIcon onClick={() => deleteBlog()} color="error" />
                        </Tooltip>
                    </>
                }
            </Box>
            <Heading>{post.title}</Heading>

            <Author>
                <Link to={`/?username=${post.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography>Author: <span style={{fontWeight: 600}}>{post.username}</span></Typography>
                </Link>
                <Box style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Tooltip title="Like" arrow TransitionComponent={Zoom}>
                        <Box style={{ display: 'flex', alignItems: 'center', marginRight: 20, cursor: 'pointer' }} onClick={() => toggleLike()}>
                            {
                                post.likes && post.likes.includes(account.username) ? 
                                <ThumbUp color="primary" fontSize="small" /> : 
                                <ThumbUpAltOutlined fontSize="small" />
                            }
                            <Typography style={{ marginLeft: 5 }}>{post.likes?.length || 0}</Typography>
                        </Box>
                    </Tooltip>
                    <Tooltip title="Dislike" arrow TransitionComponent={Zoom}>
                        <Box style={{ display: 'flex', alignItems: 'center', marginRight: 20, cursor: 'pointer' }} onClick={() => toggleDislike()}>
                            {
                                post.dislikes && post.dislikes.includes(account.username) ? 
                                <ThumbDown color="error" fontSize="small" /> : 
                                <ThumbDownAltOutlined fontSize="small" />
                            }
                            <Typography style={{ marginLeft: 5 }}>{post.dislikes?.length || 0}</Typography>
                        </Box>
                    </Tooltip>
                    <Tooltip title="Save" arrow TransitionComponent={Zoom}>
                        <Box style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginRight: 20 }} onClick={() => toggleSave()}>
                            {
                                isSaved ? 
                                <Bookmark color="primary" fontSize="small" /> : 
                                <BookmarkBorder fontSize="small" />
                            }
                        </Box>
                    </Tooltip>
                    <Box style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
                        <Tooltip title="Share" arrow TransitionComponent={Zoom}>
                            <IosShare 
                                color="primary" 
                                fontSize="small" 
                                style={{ cursor: 'pointer' }} 
                                onClick={handleMenuClick} 
                            />
                        </Tooltip>
                        <Menu
                            anchorEl={anchorEl}
                            open={openMenu}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            PaperProps={{
                                elevation: 3,
                                sx: {
                                    borderRadius: '12px',
                                    mt: 1.5,
                                    '& .MuiMenuItem-root': {
                                        px: 2,
                                        py: 1,
                                    },
                                },
                            }}
                        >
                            <MenuItem onClick={() => sharePost('copy')}>
                                <ListItemIcon>
                                    <LinkIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Copy link</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => sharePost('linkedin')}>
                                <ListItemIcon>
                                    <LinkedIn fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText>Share on LinkedIn</ListItemText>
                            </MenuItem>
                            <MenuItem onClick={() => sharePost('twitter')}>
                                <ListItemIcon>
                                    <Twitter fontSize="small" color="primary" />
                                </ListItemIcon>
                                <ListItemText>Share on X</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Typography style={{ marginLeft: 'auto' }}>{formatDate(post.createdDate)}</Typography>
                </Box>
            </Author>

            <Typography style={{ marginBottom: 20 }}>{post.description}</Typography>
            
            {post.tags && post.tags.length > 0 && (
                <Box style={{ marginBottom: 20 }}>
                    {post.tags.map(tag => (
                        <Chip key={tag} label={`#${tag}`} style={{ marginRight: 5 }} variant="outlined" />
                    ))}
                </Box>
            )}

            <Comments post={post} />
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default DetailView;