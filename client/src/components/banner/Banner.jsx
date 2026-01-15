import {styled} from '@mui/material';
import url from './headerbanner.png';
const Image = styled('img')({
    width: '100%',
    height: '50vh',
    objectFit: 'cover'
});
const Banner = () => {  
    return (
        <Image src={url} alt="banner" />
    )
}
export default Banner;