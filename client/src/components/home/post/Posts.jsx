//Arrangement of bolgs/cards on the home page
import { useEffect, useState } from 'react';
import { Grid, Box, Pagination, styled } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { API } from '../../../service/api';
//components
import Post from './Post';

const PaginationContainer = styled(Box)`
    display: flex;
    justify-content: center;
    margin: 40px 0;
    width: 100%;
`;

const Posts = () => {
    const [posts, getPosts] = useState([]);
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 8; // Posts per page

    useEffect(() => {
        // Reset to page 1 when category or search changes
        setPage(1);
    }, [category, search]);

    useEffect(() => {
        const fetchData = async () => { 
            let response = await API.getAllPosts({ 
                category: category || '', 
                search: search || '',
                page: page,
                limit: limit
            });
            if (response.isSuccess) {
                const data = response.data.posts || (Array.isArray(response.data) ? response.data : []);
                getPosts(data);
                setTotalPages(response.data.totalPages || 1);
            }
        }
        fetchData();
    }, [category, search, page]);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Grid container spacing={3}>
                {
                    posts?.length ? posts.map(post => (
                        <Grid item lg={3} sm={4} xs={12} key={post._id}>
                            <Link style={{textDecoration: 'none', color: 'inherit'}} to={`/details/${post._id}`}>
                                <Post post={post} />
                            </Link>
                        </Grid>
                    )) : (
                        <Grid item xs={12}>
                            <Box style={{color: '878787', margin: '30px 80px', fontSize: 18, textAlign: 'center'}}>
                                No data is available for selected category
                            </Box>
                        </Grid>
                    )
                }
            </Grid>
            {posts?.length > 0 && totalPages > 1 && (
                <PaginationContainer>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary" 
                        size="large"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: '#03112B',
                            },
                            '& .Mui-selected': {
                                backgroundColor: '#03112B !important',
                                color: '#fff',
                            }
                        }}
                    />
                </PaginationContainer>
            )}
        </>
    )
}

export default Posts;