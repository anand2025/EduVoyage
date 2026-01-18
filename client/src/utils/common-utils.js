export const getAccessToken = () => {
    return sessionStorage.getItem('accessToken');
}

export const getRefreshToken = () => {
    return sessionStorage.getItem('refreshToken');
}

export const setAccessToken = (accessToken) => {
    try {
        sessionStorage.setItem('accessToken', `Bearer ${accessToken}`);
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.error('Session storage limit exceeded while saving access token');
            alert('Your session storage is full. Please try clear your browser cache or log out and log in again.');
        }
    }
}

export const setRefreshToken = (refreshToken) => {
    try {
        sessionStorage.setItem('refreshToken', `Bearer ${refreshToken}`);
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.error('Session storage limit exceeded while saving refresh token');
        }
    }
}

export const getType = (value, body) => {
    if (value.params) {
        return { params: body }
    } else if (value.query) {
        return { query: body }
    }
    return {};
}

export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}