
import React from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

// Styled Components for custom look
const HeroSection = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    color: '#fff',
    padding: '100px 0',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh'
}));

const FeatureSection = styled(Box)({
    padding: '80px 0',
    backgroundColor: '#f9f9f9',
});

const Footer = styled(Box)({
    backgroundColor: '#333',
    color: '#fff',
    padding: '40px 0',
    textAlign: 'center',
});

const FeatureCard = styled(Box)({
    padding: '30px',
    textAlign: 'center',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'translateY(-10px)',
    }
});

const LandingPage = () => {
    return (
        <React.Fragment>
            {/* Hero Section */}
            <HeroSection>
                <Container maxWidth="md">
                    <Typography variant="h2" component="h1" gutterBottom style={{ fontWeight: 'bold' }}>
                        Welcome to EduVoyage
                    </Typography>
                    <Typography variant="h5" component="p" gutterBottom style={{ marginBottom: '40px', opacity: 0.9 }}>
                        Share your knowledge, explore new ideas, and connect with a community of learners.
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="secondary" 
                        size="large" 
                        component={Link} 
                        to="/account"
                        style={{ padding: '15px 40px', fontSize: '1.2rem', borderRadius: '50px', textTransform: 'none', background: '#FF6B6B' }}
                    >
                        Get Started
                    </Button>
                </Container>
            </HeroSection>

            {/* Features Section */}
            <FeatureSection>
                <Container>
                    <Typography variant="h3" component="h2" align="center" gutterBottom style={{ marginBottom: '60px', color: '#333', fontWeight: 'bold' }}>
                        Why Choose EduVoyage?
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <FeatureCard>
                                <Typography variant="h4" gutterBottom style={{ color: '#1e3c72' }}>
                                    Create
                                </Typography>
                                <Typography>
                                    Write engaging blog posts with our rich text editor. Share your insights and stories with the world.
                                </Typography>
                            </FeatureCard>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FeatureCard>
                                <Typography variant="h4" gutterBottom style={{ color: '#1e3c72' }}>
                                    Connect
                                </Typography>
                                <Typography>
                                    Join a vibrant community. Follow authors, comment on posts, and build your network.
                                </Typography>
                            </FeatureCard>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FeatureCard>
                                <Typography variant="h4" gutterBottom style={{ color: '#1e3c72' }}>
                                    Grow
                                </Typography>
                                <Typography>
                                    Expand your knowledge base. Read diverse perspectives and learn something new every day.
                                </Typography>
                            </FeatureCard>
                        </Grid>
                    </Grid>
                </Container>
            </FeatureSection>

            {/* Footer */}
            <Footer>
                <Typography variant="body1">
                    © {new Date().getFullYear()} EduVoyage. All rights reserved.
                </Typography>
            </Footer>
        </React.Fragment>
    );
};

export default LandingPage;
