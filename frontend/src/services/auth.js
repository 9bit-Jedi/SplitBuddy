import { login, register, getCurrentUser, updateCurrentUser } from '../api';

export const loginService = async (formData, setAlert, setAlertMessage) => {
    try {
        const response = await login(formData);
        // Assuming the API returns data in response.data
        if (response.data.access) {
            localStorage.setItem('profile', JSON.stringify(response.data));
        }
        return response;
    } catch (error) {
        setAlert(true);
        setAlertMessage(error.response?.data?.message || 'Login failed');
        window.scroll(0, 0);
    }
};

export const registerService = async (formData, setAlert, setAlertMessage) => {
    try {
        const response = await register(formData);
        return response;
    } catch (error) {
        setAlert(true);
        setAlertMessage(error.response?.data?.message || 'Registration failed');
        window.scroll(0, 0);
    }
};

export const getUserService = async (setAlert, setAlertMessage) => {
    try {
        const response = await getCurrentUser();
        return response;
    } catch (error) {
        setAlert(true);
        setAlertMessage(error.response?.data?.message || 'Failed to fetch user data');
        window.scroll(0, 0);
    }
}

export const updateUserService = async (formData, setAlert, setAlertMessage) => {
    try {
        const response = await updateCurrentUser(formData);
        return response;
    } catch (error) {
        setAlert(true);
        setAlertMessage(error.response?.data?.message || 'Failed to update user');
        window.scroll(0, 0);
    }
}

export const logoutService = () => {
    localStorage.removeItem('profile');
};
