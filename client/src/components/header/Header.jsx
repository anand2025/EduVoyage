import { AppBar, Button, Toolbar, styled} from '@mui/material'; 
import { Link } from 'react-router-dom';
import { useContext } from 'react';
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

const Header = ({ isUserAuthenticated }) => {       
    const { account } = useContext(DataContext);

    const logout = async () => {
        sessionStorage.clear();
        isUserAuthenticated(false);
    }

    return (
        <Component>
            <Container>
                <Link to='/'>HOME</Link>
                <Link to={`/profile/${account.username}`}>PROFILE</Link>
                <LogoutButton variant="contained" onClick={() => logout()}>
                    LOGOUT
                </LogoutButton>
            </Container>
        </Component>
    )
}

export default Header;