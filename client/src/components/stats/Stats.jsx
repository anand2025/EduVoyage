import { useState, useEffect, useContext } from 'react';
import { Box, Grid, Typography, Paper, styled, LinearProgress, alpha } from '@mui/material';
import { 
    PostAdd as PostIcon, 
    Favorite as LikeIcon, 
    Comment as CommentIcon, 
    BarChart as ChartIcon,
    ThumbDown as DislikeIcon
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';

import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';

const Container = styled(Box)(({ theme }) => ({
    padding: '50px 8%',
    background: '#FFFFFF',
    minHeight: '80vh',
    [theme.breakpoints.down('md')]: {
        padding: '30px 5%'
    }
}));

const HeaderSection = styled(Box)`
    margin-bottom: 40px;
    text-align: center;
`;

const StatCard = styled(Paper)(({ theme }) => ({
    padding: '25px',
    borderRadius: '15px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: alpha('#03112B', 0.03),
    border: `1px solid ${alpha('#03112B', 0.1)}`,
    boxShadow: 'none',
    transition: 'transform 0.3s ease, background 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        background: alpha('#03112B', 0.06),
        borderColor: '#93AFC9'
    }
}));

const IconWrapper = styled(Box)(({ color }) => ({
    backgroundColor: alpha(color, 0.1),
    color: color,
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));

const ProgressBarContainer = styled(Box)`
    width: 100%;
    margin-top: 10px;
`;

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: alpha('#03112B', 0.1),
    [`& .MuiLinearProgress-bar`]: {
        borderRadius: 5,
        backgroundColor: '#03112B',
    },
}));

const CategoryBox = styled(Box)`
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 10px;
    background: #fff;
    border: 1px solid #f0f0f0;
`;

const Stats = () => {
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalLikes: 0,
        totalDislikes: 0,
        totalComments: 0,
        categoryStats: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { username } = useParams();
    const { account } = useContext(DataContext);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const targetUsername = username || account.username;
                console.log('Fetching stats. Params username:', username, 'Account username:', account.username, 'Final target:', targetUsername);
                let response = await API.getAuthorStats(targetUsername);
                if (response.isSuccess && response.data) {
                    setStats(response.data);
                } else if (response.isError) {
                    setError(response.msg || "Failed to fetch statistics");
                }
            } catch (err) {
                console.error("Error fetching stats:", err);
                setError("An unexpected error occurred while loading stats.");
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, [username, account.username]);

    if (loading) return (
        <Container>
            <LinearProgress sx={{ backgroundColor: '#93AFC9', '& .MuiLinearProgress-bar': { backgroundColor: '#03112B' } }} />
        </Container>
    );

    return (
        <Container>
            <HeaderSection>
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#03112B', marginBottom: '10px' }}>
                    Author Analytics
                </Typography>
                <Typography variant="body1" sx={{ color: '#666', fontSize: '1.1rem' }}>
                    Deep dive into the performance of your EduVoyage journey
                </Typography>
            </HeaderSection>

            <Grid container spacing={4}>
                {/* High Level Metrics */}
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard>
                        <IconWrapper color="#03112B">
                            <PostIcon fontSize="large" />
                        </IconWrapper>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#03112B' }}>{stats?.totalPosts || 0}</Typography>
                        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>Total Posts</Typography>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard>
                        <IconWrapper color="#E91E63">
                            <LikeIcon fontSize="large" />
                        </IconWrapper>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#03112B' }}>{stats?.totalLikes || 0}</Typography>
                        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>Total Engagement</Typography>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard>
                        <IconWrapper color="#2196F3">
                            <CommentIcon fontSize="large" />
                        </IconWrapper>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#03112B' }}>{stats?.totalComments || 0}</Typography>
                        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>Total Comments</Typography>
                    </StatCard>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <StatCard>
                        <IconWrapper color="#FF9800">
                            <ChartIcon fontSize="large" />
                        </IconWrapper>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#03112B' }}>
                            {(stats?.totalPosts > 0) ? (stats.totalLikes / stats.totalPosts).toFixed(1) : 0}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>Likes Per Post</Typography>
                    </StatCard>
                </Grid>

                {/* Category Breakdown */}
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 4, borderRadius: '15px', border: '1px solid #f0f0f0', boxShadow: 'none', background: alpha('#03112B', 0.01) }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#03112B', mb: 3 }}>
                            Content Distribution
                        </Typography>
                        {(stats && stats.categoryStats && Object.keys(stats.categoryStats).length > 0) ? (
                            Object.entries(stats.categoryStats).map(([category, count]) => (
                                <CategoryBox key={category}>
                                    <Box display="flex" justifyContent="space-between" mb={1}>
                                        <Typography sx={{ fontWeight: 600, color: '#333' }}>{category}</Typography>
                                        <Typography sx={{ color: '#666' }}>{count} posts</Typography>
                                    </Box>
                                    <ProgressBarContainer>
                                        <StyledLinearProgress variant="determinate" value={(count / (stats?.totalPosts || 1)) * 100} />
                                    </ProgressBarContainer>
                                </CategoryBox>
                            ))
                        ) : (
                            <Typography sx={{ color: '#999', textAlign: 'center', py: 5 }}>
                                No category data available. Start writing to see your distribution!
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Engagement Health */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 4, borderRadius: '15px', border: '1px solid #f0f0f0', boxShadow: 'none', background: '#03112B', color: '#fff', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                            Engagement Sentiment
                        </Typography>
                        <Box display="flex" alignItems="center" mb={3}>
                            <LikeIcon sx={{ mr: 2, color: '#93AFC9' }} />
                            <Box flex={1}>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>Likes</Typography>
                                <Typography variant="h6">{stats?.totalLikes || 0}</Typography>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <DislikeIcon sx={{ mr: 2, color: '#f44336' }} />
                            <Box flex={1}>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>Dislikes</Typography>
                                <Typography variant="h6">{stats?.totalDislikes || 0}</Typography>
                            </Box>
                        </Box>
                        <Box mt={4} pt={4} borderTop={`1px solid ${alpha('#fff', 0.1)}`}>
                            <Typography sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                                "Quality content speaks for itself. Your engagement ratio reflects your connection with the audience."
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            {error && (
                <Typography sx={{ color: '#f44336', textAlign: 'center', mt: 4, fontWeight: 600 }}>
                    Error: {error}
                </Typography>
            )}
        </Container>
    );
}

export default Stats;
