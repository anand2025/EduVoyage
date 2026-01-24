import { AppBar, Button, Toolbar, styled, InputBase, Box, alpha } from '@mui/material'; 
import { Search as SearchIcon, Home as HomeIcon, Person as PersonIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { DataContext } from '../../context/DataProvider';

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
    const { account } = useContext(DataContext);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

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
                    <Link to={`/profile/${account.username}`}>
                        <PersonIcon style={{ color: '#03112B', fontSize: 30 }} />
                    </Link>
                    <LogoutButton variant="contained" onClick={() => logout()}>
                        LOGOUT
                    </LogoutButton>
                </MobileIcons>
            </Container>
        </Component>
    )
}

export default Header;