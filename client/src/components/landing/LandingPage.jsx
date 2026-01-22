import React from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/system';
import heroBg from '../../assets/images/landing-bg.png';

// Styled Components for custom look
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeroSection = styled(Box)(({ theme }) => ({
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: '#fff',
    padding: '100px 0',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    animation: `${fadeIn} 1s ease-out`
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
    padding: '40px',
    textAlign: 'center',
    borderRadius: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    transition: 'all 0.4s ease',
    border: '1px solid rgba(0,0,0,0.05)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '&:hover': {
        transform: 'translateY(-15px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        borderColor: '#2a5298',
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
                        style={{ 
                            padding: '15px 50px', 
                            fontSize: '1.2rem', 
                            borderRadius: '50px', 
                            textTransform: 'none', 
                            background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                            fontWeight: '600',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Get Started
                    </Button>
                </Container>
            </HeroSection>

            {/* Features Section */}
            <FeatureSection>
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <FeatureCard style={{ animation: `${fadeIn} 1s ease-out 0.2s backwards` }}>
                                <Typography variant="h4" gutterBottom style={{ color: '#1e3c72', fontWeight: 600 }}>
                                    Create
                                </Typography>
                                <Typography>
                                    Write engaging blog posts with our rich text editor. Share your insights and stories with the world.
                                </Typography>
                            </FeatureCard>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FeatureCard style={{ animation: `${fadeIn} 1s ease-out 0.4s backwards` }}>
                                <Typography variant="h4" gutterBottom style={{ color: '#1e3c72', fontWeight: 600 }}>
                                    Connect
                                </Typography>
                                <Typography>
                                    Join a vibrant community. Follow authors, comment on posts, and build your network.
                                </Typography>
                            </FeatureCard>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FeatureCard style={{ animation: `${fadeIn} 1s ease-out 0.6s backwards` }}>
                                <Typography variant="h4" gutterBottom style={{ color: '#1e3c72', fontWeight: 600 }}>
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
