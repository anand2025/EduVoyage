import { AppBar, Button, Toolbar, styled, InputBase, Box, alpha } from '@mui/material'; 
import { Search as SearchIcon, Home as HomeIcon, Person as PersonIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { DataContext } from '../../context/DataProvider';

const Component = styled(AppBar)`
    background: #FFFFFF;
    color: black;
`;

const Container = styled(Toolbar)`
    justify-content: end;
    & > a {
        padding: 20px;
        color: #000;
        text-decoration: none;
        font-weight: 600;
    }
`
const LogoutButton = styled(Button)`
    text-transform: none;
    text-decoration:none;
    background: #03112B;
    color: #fff;
    height: 40px;
    border-radius: 8px;
    margin-left: 20px;
    &:hover {
        background-color: #93AFC9;
        color:#03112B;
    }
`;

const SearchContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: alpha('#000000', 0.05),
    borderRadius: '20px',
    padding: '2px 15px',
    width: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
    transition: 'all 0.3s ease',
    border: '1px solid transparent',
    '&:focus-within': {
        width: '40%',
        backgroundColor: '#fff',
        border: '1px solid #03112B',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }
}));

const StyledInputBase = styled(InputBase)`
    margin-left: 8px;
    flex: 1;
    font-size: 0.9rem;
    color: #333;
`;

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
            navigate(`/?search=${e.target.value}`);
        } else {
            navigate('/');
        }
    }

    return (
        <Component>
            <Container>
                <Link to='/'>
                    <HomeIcon style={{ color: '#03112B', fontSize: 30 }} />
                </Link>
                
                <SearchContainer>
                    <SearchIcon style={{ color: '#03112B', opacity: 0.6 }} fontSize="small" />
                    <StyledInputBase
                        placeholder="Search posts or tags..."
                        value={searchText}
                        onChange={(e) => onSearchChange(e)}
                    />
                </SearchContainer>

                <Link to={`/profile/${account.username}`}>
                    <PersonIcon style={{ color: '#03112B', fontSize: 30 }} />
                </Link>
                <LogoutButton variant="contained" onClick={() => logout()}>
                    LOGOUT
                </LogoutButton>
            </Container>
        </Component>
    )
}

export default Header;