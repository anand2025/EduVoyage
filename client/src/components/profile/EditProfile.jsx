import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, Box, styled, IconButton 
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { API } from '../../service/api';

const StyledDialog = styled(Dialog)`
    .MuiPaper-root {
        padding: 10px;
        border-radius: 15px;
        min-width: 400px;
    }
`;

const AvatarContainer = styled(Box)`
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto 20px;
`;

const PreviewImage = styled('img')({
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #1976d2'
});

const UploadOverlay = styled(IconButton)`
    position: absolute;
    bottom: 0;
    right: 0;
    background: #1976d2;
    color: #fff;
    &:hover {
        background: #1565c0;
    }
`;

const EditProfile = ({ open, setOpen, user, setUser }) => {
    const [formData, setFormData] = useState({
        name: user.name,
        bio: user.bio,
        profilePicture: user.profilePicture
    });

    useEffect(() => {
        setFormData({
            name: user.name,
            bio: user.bio,
            profilePicture: user.profilePicture
        });
    }, [user]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        let response = await API.updateUser({
            username: user.username,
            ...formData
        });
        
        if (response.isSuccess) {
            setUser({ ...user, ...formData });
            handleClose();
        }
    };

    return (
        <StyledDialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
                <AvatarContainer>
                    <PreviewImage 
                        src={formData.profilePicture || 'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png'} 
                        alt="Profile" 
                    />
                    <label htmlFor="icon-button-file">
                        <input
                            accept="image/*"
                            id="icon-button-file"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => onFileChange(e)}
                        />
                        <UploadOverlay aria-label="upload picture" component="span">
                            <PhotoCamera fontSize="small" />
                        </UploadOverlay>
                    </label>
                </AvatarContainer>
                
                <TextField
                    autoFocus
                    margin="dense"
                    name="name"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.name}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    name="bio"
                    label="Bio"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={formData.bio}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="inherit" sx={{ textTransform: 'none' }}>
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary" variant="contained" sx={{ textTransform: 'none' }}>
                    Save Changes
                </Button>
            </DialogActions>
        </StyledDialog>
    );
}

export default EditProfile;
