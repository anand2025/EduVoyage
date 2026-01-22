import { Button, styled, Box } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { categories } from '../../constants/data';

const StyledButton = styled(Button)`
    margin: 20px;
    width: 85%;
    background: #03112B;
    color: #fff;
    text-decoration: none;
    &:hover {
        background-color: #93AFC9;
        color: #03112B;
    }
`;

const Container = styled(Box)(({ theme }) => ({ 
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
        display: 'flex',
        overflowX: 'auto', // Horizontal scroll on mobile
        whiteSpace: 'nowrap',
        padding: '10px 0',
        '&::-webkit-scrollbar': {
            display: 'none' // Hide scrollbar for cleaner look
        }
    }
}));

const StyledLink = styled(Link)(({ theme }) => ({
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    padding: '10px 20px',
    borderBottom: '1px solid #e0e0e0', // Separator for vertical list
    '&:hover': {
        color: '#03112B',
        backgroundColor: '#f5f5f5'
    },
    [theme.breakpoints.down('sm')]: {
        display: 'inline-block',
        borderBottom: 'none',
        border: '1px solid #e0e0e0', // Box style for horizontal items
        borderRadius: '20px',
        margin: '0 5px',
        padding: '5px 15px',
        fontSize: '14px',
        backgroundColor: '#f9f9f9'
    }
}));

const Categories = () => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    
    return (
        <>
            <Link to={`/create?category=${category || ''}`} style={{ textDecoration: 'none' }}>
                <StyledButton variant="contained">CREATE BLOG</StyledButton>
            </Link>
            
            <Container>
                <StyledLink to={"/"}>
                    All Categories
                </StyledLink>
                {
                    categories.map(cat => (
                        <StyledLink key={cat.id} to={`/?category=${cat.type}`}>
                            {cat.type}
                        </StyledLink>
                    ))
                }
            </Container>
        </>
    )
}

export default Categories;