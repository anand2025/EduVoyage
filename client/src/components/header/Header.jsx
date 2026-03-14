import { AppBar, Button, Toolbar, styled, InputBase, Box, alpha, Dialog, DialogTitle, DialogContent, DialogActions, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'; 
import { Search as SearchIcon, Home as HomeIcon, Person as PersonIcon, BarChart as ChartIcon, Star as PremiumIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { DataContext } from '../../context/DataProvider';
import { API } from '../../service/api';
import { setAccessToken, setRefreshToken } from '../../utils/common-utils';

const Component = styled(AppBar)`
    background: #FFFFFF;
    color: black;
`;

const Container = styled(Toolbar)(({ theme }) => ({ 
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
    padding: '0 5% !important',
    margin: '0 auto',
    [theme.breakpoints.down('md')]: {
        padding: '0 2% !important'
    },
    '& > a': {
        padding: '20px',
        color: '#000',
        textDecoration: 'none',
        fontWeight: 600,
        [theme.breakpoints.down('sm')]: {
            padding: '10px'
        }
    }
}));

const PremiumButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    background: 'linear-gradient(45deg, #FFD700 30%, #FF8C00 90%)',
    color: '#000',
    height: '40px',
    borderRadius: '8px',
    marginLeft: '10px',
    fontWeight: 'bold',
    '&:hover': {
        background: 'linear-gradient(45deg, #FF8C00 30%, #FFD700 90%)',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
        padding: '5px 10px',
        marginLeft: '5px'
    }
}));

const PremiumBadge = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    color: '#E8A317',
    marginLeft: '10px',
    fontWeight: 'bold',
    fontSize: '1.1rem'
});

const LogoutButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    textDecoration: 'none',
    background: '#03112B',
    color: '#fff',
    height: '40px',
    borderRadius: '8px',
    marginLeft: '20px',
    '&:hover': {
        backgroundColor: '#93AFC9',
        color: '#03112B',
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '0.8rem',
        padding: '5px 10px',
        marginLeft: '10px'
    }
}));

const SearchContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: alpha('#000000', 0.05),
    borderRadius: '20px',
    padding: '2px 15px',
    width: '30%', // default for desktop
    margin: '0 20px', // margins to separate from icons
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
    '&:focus-within': {
        width: '40%',
        backgroundColor: '#fff',
        border: '1px solid #03112B',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    [theme.breakpoints.down('md')]: {
        width: '50%',
        '&:focus-within': {
            width: '60%',
        }
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%',
        margin: '0 10px',
        padding: '2px 10px',
        order: 1, // Optional: if we wanted to reorder, but flexible box works well
        marginTop: 5,
        marginBottom: 5
    }
}));

const StyledInputBase = styled(InputBase)`
    margin-left: 8px;
    flex: 1;
    font-size: 0.9rem;
    color: #333;
`;

// const IconWrapper = styled(Box)(({ theme }) => ({
//     display: 'flex',
//     alignItems: 'center',
//     [theme.breakpoints.down('sm')]: {
//         display: 'none' // Hide icons on very small screens if needed, or adjust
//     }
// }));

// Mobile wrapper for icons to keeping them visible
const MobileIcons = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    '& > a': {
        color: '#000', 
        padding: '10px',
        display: 'flex',
        alignItems: 'center'
    }
}));


const Header = ({ isUserAuthenticated }) => {       
    const { account, setAccount } = useContext(DataContext);
    const [searchText, setSearchText] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const navigate = useNavigate();

    const handleSubscribe = async () => {
        setConfirmOpen(false); // Close dialog immediately first
        let response = await API.subscribeUser();
        if (response.isSuccess) {
            sessionStorage.setItem('isPremium', 'true');
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            setAccount(prev => ({ ...prev, isPremium: true }));
        }
    }

    const logout = async () => {
        sessionStorage.clear();
        isUserAuthenticated(false);
    }

    const onSearchChange = (e) => {
        setSearchText(e.target.value);
        if (e.target.value) {
            navigate(`/home?search=${e.target.value}`);
        } else {
            navigate('/home');
        }
    }

    return (
        <>
        <Component>
            <Container>
                {/* Logo / Home */}
                <Link to='/home'>
                    <HomeIcon style={{ color: '#03112B', fontSize: 30 }} />
                </Link>
                
                {/* Search Bar */}
                <SearchContainer>
                    <SearchIcon style={{ color: '#03112B', opacity: 0.6 }} fontSize="small" />
                    <StyledInputBase
                        placeholder="Search posts..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e)}
                    />
                </SearchContainer>

                {/* Right Side Icons */}
                <MobileIcons>
                    <Link to={`/stats/${account.username}`}>
                        <ChartIcon style={{ color: '#03112B', fontSize: 30 }} />
                    </Link>
                    <Link to={`/profile/${account.username}`}>
                        <PersonIcon style={{ color: '#03112B', fontSize: 30 }} />
                    </Link>
                    { account.isPremium ? (
                        <PremiumBadge>
                            <PremiumIcon /> Premium
                        </PremiumBadge>
                    ) : (
                        <PremiumButton variant="contained" onClick={() => setConfirmOpen(true)}>
                            Go Premium
                        </PremiumButton>
                    )}
                    <LogoutButton variant="contained" onClick={() => logout()}>
                        LOGOUT
                    </LogoutButton>
                </MobileIcons>
            </Container>
        </Component>

        {/* Premium Confirmation Dialog */}
        <Dialog 
            open={confirmOpen} 
            onClose={() => setConfirmOpen(false)} 
            maxWidth="xs" 
            fullWidth
            keepMounted={false}
            disableScrollLock
            PaperProps={{ style: { borderRadius: 16, padding: '8px' } }}>
            <DialogTitle style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.4rem' }}>
                <PremiumIcon style={{ color: '#E8A317', verticalAlign: 'middle', marginRight: 8, fontSize: 28 }} />
                Go Premium
            </DialogTitle>
            <DialogContent>
                <Typography style={{ color: '#555', marginBottom: 12, textAlign: 'center' }}>
                    Unlock exclusive premium content and features:
                </Typography>
                <List dense>
                    <ListItem>
                        <ListItemIcon><PremiumIcon style={{ color: '#E8A317' }} /></ListItemIcon>
                        <ListItemText primary="Access all premium-only posts" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><PremiumIcon style={{ color: '#E8A317' }} /></ListItemIcon>
                        <ListItemText primary="Publish exclusive premium content" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><PremiumIcon style={{ color: '#E8A317' }} /></ListItemIcon>
                        <ListItemText primary="Premium badge on your profile" />
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center', gap: 12, paddingBottom: 20 }}>
                <Button onClick={() => setConfirmOpen(false)} variant="outlined"
                    style={{ borderRadius: 8, textTransform: 'none', minWidth: 100 }}>
                    Cancel
                </Button>
                <PremiumButton onClick={handleSubscribe} style={{ minWidth: 140 }}>
                    Confirm Upgrade
                </PremiumButton>
            </DialogActions>
        </Dialog>
    </>
    )
}

export default Header;