//navbar containg logout button
import { AppBar, Button, Toolbar, styled} from '@mui/material'; 
import { Link } from 'react-router-dom';

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
    }
`
const LogoutButton = styled(Button)`
    text-transform: none;
    text-decoration:none;
    background: #03112B;
    color: #fff;
    height: 40px;
    border-radius: 2px;
    &:hover {
    background-color: #93AFC9;
    color:#03112B;
  }
`;
const Linkacc=styled(Link)`
    text-decoration:none;
    color:white;
    &:hover{
        color:#03112B;
    }`

const Header = () => {       
    return (
        <Component>
            <Container>
            <LogoutButton variant="contained">
                <Linkacc to='/account'>LOGOUT</Linkacc>
            </LogoutButton>
            </Container>
        </Component>
    )
}

export default Header;