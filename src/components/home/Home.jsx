import { Grid } from '@mui/material';
//components
import Banner from '../banner/Banner';
import Categories from './Categories';
import Posts from './post/Posts';

//The Material Design responsive layout grid adapts to screen size and orientation,
// ensuring consistency across layouts.(12-columns grid layout)
const Home = () => {
    return (
        <>
            <Banner />
            <Grid container>
                <Grid item lg={2} xs={12} sm={2}>
                    <Categories />
                </Grid>
                <Grid container item xs={12} sm={10} lg={10}>
                    <Posts />
                </Grid>
            </Grid>
        </>
    )
}

export default Home;