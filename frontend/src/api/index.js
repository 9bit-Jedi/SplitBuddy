import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// We can use an empty baseURL because the frontend and backend are served from the same domain.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || ''
});

// Use an interceptor to add the auth token to every request.
API.interceptors.request.use(async (req) => {
  // Check if localStorage is available (for server-side rendering compatibility)
  if (typeof window !== 'undefined' && localStorage.getItem('profile')) {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile && profile.access) {
      const decodedToken = jwtDecode(profile.access);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        try {
          const response = await refreshToken({ refresh: profile.refresh });
          const newProfile = { ...profile, access: response.data.access };
          localStorage.setItem('profile', JSON.stringify(newProfile));
          req.headers.Authorization = `Bearer ${response.data.access}`;
        } catch (error) {
          console.error('Error refreshing token:', error);
          // Handle token refresh error (e.g., redirect to login)
        }
      } else {
        req.headers.Authorization = `Bearer ${profile.access}`;
      }
    }
  }
  return req;
});

// User endpoints
export const register = (formData) => API.post('/api/users/register/', formData);
export const login = (formData) => API.post('/api/users/login/', formData);
export const refreshToken = (formData) => API.post('/api/users/token/refresh/', formData);
export const getCurrentUser = () => API.get('/api/users/me/');
export const updateCurrentUser = (formData) => API.put('/api/users/me/', formData);

// Group endpoints
export const getUserGroups = () => API.get('/api/groups/');
export const createGroup = (formData) => API.post('/api/groups/', formData);
export const getGroupDetails = (groupId) => API.get(`/api/groups/${groupId}/`);
export const addGroupMember = (groupId, memberData) => API.post(`/api/groups/${groupId}/members/`, memberData);
export const updateGroupMember = (groupId, memberData) => API.put(`/api/groups/${groupId}/members/`, memberData);
export const removeGroupMember = (groupId, memberData) => API.delete(`/api/groups/${groupId}/members/`, { data: memberData });
export const getSimplifiedDebts = (groupId) => API.get(`/api/groups/${groupId}/debts/simplify/`);
export const createSettlement = (groupId, settlementData) => API.post(`/api/groups/${groupId}/settlements/`, settlementData);

// Expense endpoints
export const createExpense = (expenseData) => API.post('/api/expenses/', expenseData);
export const settleExpense = (expenseId) => API.post(`/api/expenses/${expenseId}/settle/`);
export const getExpenseDetails = (expenseId) => API.get(`/api/expenses/${expenseId}/`);
export const getGroupExpenses = (groupId) => API.get(`/api/expenses/group/${groupId}/`);
export const getUserMonthlyExpenses = () => API.get('/api/expenses/user/monthly-expenses/');
export const getUserCategoryExpenses = () => API.get('/api/expenses/user/category-expenses/');

// Analytics endpoints
export const getGroupBudget = (groupId) => API.get(`/api/analytics/${groupId}/budget/`);
export const getGroupCategorySpending = (groupId) => API.get(`/api/analytics/${groupId}/categories/`);
export const getGroupLeaderboard = (groupId) => API.get(`/api/analytics/${groupId}/leaderboard/`);

export default API;
