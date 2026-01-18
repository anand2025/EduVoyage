import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Avatar, Button, Grid, Tabs, Tab, styled, Divider } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
import Post from '../home/post/Post';
import EditProfile from './EditProfile';
import { formatDate } from '../../utils/common-utils';

const Container = styled(Box)`
    margin: 50px 100px;
    @media (max-width: 600px) {
        margin: 20px 10px;
    }
`;

const ProfileHeader = styled(Box)`
    display: flex;
    align-items: center;
    background: #fff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    margin-bottom: 40px;
    @media (max-width: 600px) {
        flex-direction: column;
        padding: 20px;
        text-align: center;
    }
`;

const StyledAvatar = styled(Avatar)`
    width: 150px;
    height: 150px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    border: 4px solid #fff;
`;

const InfoSection = styled(Box)`
    margin-left: 50px;
    flex: 1;
    @media (max-width: 600px) {
        margin-left: 0;
        margin-top: 20px;
    }
`;

const UserName = styled(Typography)`
    font-size: 32px;
    font-weight: 600;
    color: #333;
`;

const UserHandle = styled(Typography)`
    color: #666;
    font-size: 18px;
    margin-bottom: 10px;
`;

const Bio = styled(Typography)`
    color: #444;
    margin: 15px 0;
    line-height: 1.6;
`;

const DateText = styled(Typography)`
    font-size: 14px;
    color: #878787;
`;

const EditButton = styled(Button)`
    text-transform: none;
    background: #1976d2;
    color: #fff;
    border-radius: 8px;
    padding: 8px 24px;
    &:hover {
        background: #1565c0;
    }
`;

const TabSection = styled(Box)`
    margin-top: 20px;
`;

const Profile = () => {
    const { username } = useParams();
    const { account } = useContext(DataContext);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [openEdit, setOpenEdit] = useState(false);

    const isOwner = account.username === username;

    useEffect(() => {
        const fetchUserData = async () => {
            let response = await API.getUserByUsername(username);
            if (response.isSuccess) {
                setUser(response.data);
            }
        };
        fetchUserData();
    }, [username]);

    useEffect(() => {
        const fetchPosts = async () => {
            let response = await API.getAllPosts({ username: username });
            if (response.isSuccess) {
                setPosts(response.data);
            }
        };
        fetchPosts();
    }, [username]);

    useEffect(() => {
        if (isOwner) {
            const fetchSavedPosts = async () => {
                let response = await API.getSavedPosts(account.username);
                if (response.isSuccess) {
                    // Fetch details for each saved post ID
                    const postDetails = await Promise.all(
                        response.data.map(async (id) => {
                            let res = await API.getPostById(id);
                            return res.isSuccess ? res.data : null;
                        })
                    );
                    setSavedPosts(postDetails.filter(p => p !== null));
                }
            };
            fetchSavedPosts();
        }
    }, [isOwner, account.username]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (!user) return <Typography>Loading...</Typography>;

    return (
        <Container>
            <ProfileHeader>
                <StyledAvatar src={user.profilePicture || ''} alt={user.name}>
                    {user.name.charAt(0).toUpperCase()}
                </StyledAvatar>
                <InfoSection>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
                        <Box>
                            <UserName>{user.name}</UserName>
                            <UserHandle>@{user.username}</UserHandle>
                        </Box>
                        {isOwner && (
                            <EditButton onClick={() => setOpenEdit(true)}>
                                Edit Profile
                            </EditButton>
                        )}
                    </Box>
                    <Bio>{user.bio || "No bio yet."}</Bio>
                    <DateText>Joined {formatDate(user.createdDate)}</DateText>
                </InfoSection>
            </ProfileHeader>

            <TabSection>
                <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
                    <Tab label={`Posts (${posts.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
                    {isOwner && <Tab label={`Saved (${savedPosts.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />}
                </Tabs>
                <Divider />
                
                <Box mt={3}>
                    {tabValue === 0 && (
                        <Grid container spacing={3}>
                            {posts.length > 0 ? posts.map(post => (
                                <Grid item lg={3} sm={4} xs={12} key={post._id}>
                                    <Link style={{textDecoration: 'none', color: 'inherit'}} to={`/details/${post._id}`}>
                                        <Post post={post} />
                                    </Link>
                                </Grid>
                            )) : (
                                <Typography m={5} color="#878787">User hasn't written any posts yet.</Typography>
                            )}
                        </Grid>
                    )}
                    {tabValue === 1 && isOwner && (
                        <Grid container spacing={3}>
                            {savedPosts.length > 0 ? savedPosts.map(post => (
                                <Grid item lg={3} sm={4} xs={12} key={post._id}>
                                    <Link style={{textDecoration: 'none', color: 'inherit'}} to={`/details/${post._id}`}>
                                        <Post post={post} />
                                    </Link>
                                </Grid>
                            )) : (
                                <Typography m={5} color="#878787">You haven't saved any posts yet.</Typography>
                            )}
                        </Grid>
                    )}
                </Box>
            </TabSection>
            
            <EditProfile 
                open={openEdit} 
                setOpen={setOpenEdit} 
                user={user} 
                setUser={setUser} 
            />
        </Container>
    );
}

export default Profile;
