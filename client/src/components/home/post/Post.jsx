import { styled, Box, Typography } from '@mui/material';

const Container = styled(Box)`
    border: 1px solid #d3cede;
    border-radius: 10px;
    margin: 10px;
    display: flex;
    align-items: center;
    flex-direction: column;
    height: auto;
    min-height: 350px;
    padding-bottom: 10px;
    & > img, & > p {
        padding: 0 5px 5px 5px;
    }
`;

const Image = styled('img')({
    width: '100%',
    objectFit: 'cover',
    borderRadius: '10px 10px 0 0',
    height: 150
});

const Text = styled(Typography)`
    color: #878787;
    font-size: 12px;
`;

const Heading = styled(Typography)`
    font-size: 18px;
    font-weight: 600;
`;

const Details = styled(Typography)`
    font-size: 14px;
    word-break: break-word;
`;

const Post = ({ post }) => {
    const url = post.picture ? post.picture : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=752&q=80';
    
    //adding three dots...if text is not able to fix in that card
    const addEllipsis = (str, limit) => {
        return str.length > limit ? str.substring(0, limit) + '...' : str;
    } 

    return (
        <Container>
            <Image src={url} alt="post" />
            <Text>{post.categories}</Text>
            <Heading>{addEllipsis(post.title, 20)}</Heading>
            <Text>Author: {post.username}</Text>
            {post.tags && post.tags.length > 0 && (
                <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px', marginTop: '5px' }}>
                    {post.tags.slice(0, 3).map(tag => (
                        <Typography key={tag} style={{ fontSize: '10px', color: '#3f51b5' }}>#{tag}</Typography>
                    ))}
                    {post.tags.length > 3 && <Typography style={{ fontSize: '10px' }}>...</Typography>}
                </Box>
            )}
            <Details>{addEllipsis(post.description, 100)}</Details>
        </Container>
    )
}

export default Post;