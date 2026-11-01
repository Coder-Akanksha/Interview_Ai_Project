import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/auth',
    withCredentials: true
});

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/register', {
            username,
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post('/login', {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

export async function logout() {
    try {
        const response = await api.get('/logout');
        return response.data;
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        const response = await api.get('/get-user');
        return response.data;
    } catch (error) {
        if (error.response?.status !== 401) {
            console.error('Error fetching current user:', error);
        }
        throw error;
    }
}
