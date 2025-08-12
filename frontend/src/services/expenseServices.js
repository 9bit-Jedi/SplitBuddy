import {
  createExpense,
  settleExpense,
  getExpenseDetails,
  getGroupExpenses,
  getGroupBudget,
  getGroupCategorySpending,
  getGroupLeaderboard,
  getUserMonthlyExpenses,
  getUserCategoryExpenses,
} from '../api';

export const getUserCategoryExpService = async (setAlert, setAlertMessage) => {
  try {
    const response = await getUserCategoryExpenses();
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to fetch category expenses');
    window.scroll(0, 0);
  }
};

export const getUserMonthlyExpService = async (setAlert, setAlertMessage) => {
  try {
    const response = await getUserMonthlyExpenses();
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to fetch monthly expenses');
    window.scroll(0, 0);
  }
};

export const createExpenseService = async (expenseData, setAlert, setAlertMessage) => {
  try {
    const response = await createExpense(expenseData);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to create expense');
    window.scroll(0, 0);
  }
};

export const settleExpenseService = async (expenseId, setAlert, setAlertMessage) => {
  try {
    const response = await settleExpense(expenseId);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to settle expense');
    window.scroll(0, 0);
  }
};

export const getExpenseDetailsService = async (expenseId, setAlert, setAlertMessage) => {
  try {
    const response = await getExpenseDetails(expenseId);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to fetch expense details');
    window.scroll(0, 0);
  }
};

export const getGroupExpensesService = async (groupId, setAlert, setAlertMessage) => {
  try {
    const response = await getGroupExpenses(groupId);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to fetch group expenses');
    window.scroll(0, 0);
  }
};

export const getGroupBudgetService = async (groupId, setAlert, setAlertMessage) => {
  try {
    const response = await getGroupBudget(groupId);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to fetch group budget');
    window.scroll(0, 0);
  }
};

export const getGroupCategorySpendingService = async (groupId, setAlert, setAlertMessage) => {
  try {
    const response = await getGroupCategorySpending(groupId);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to fetch category spending');
    window.scroll(0, 0);
  }
};

export const getGroupLeaderboardService = async (groupId, setAlert, setAlertMessage) => {
  try {
    const response = await getGroupLeaderboard(groupId);
    return response.data;
  } catch (error) {
    setAlert(true);
    setAlertMessage(error.response?.data?.message || 'Failed to fetch leaderboard');
    window.scroll(0, 0);
  }
};