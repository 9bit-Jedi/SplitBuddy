import { useRoutes } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/dashboard/LogoOnlyLayout';

// Config
import configData from './config.json';

// Core Components
import Page404 from './components/Page404';
import About from './components/about';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PageUserDeleted from './components/profile/PageUserDeleted';

// Dashboard Components
import Dashboard from './components/dashboard';
import Profile from './components/profile';

// Group Components
import Group from './components/groups';
import CreateGroup from './components/groups/createGroup';
import ViewGroup from './components/groups/viewGroup';
import { EditGroup } from './components/groups/editGroup';

// Expense Components
import AddExpense from './components/expense/addExpense';
import { ViewExpense } from './components/expense/ViewExpense';
import EditExpense from './components/expense/editExpense';

export default function Router() {
  return useRoutes([
    {
      path: configData.DASHBOARD_HOME_URL,
      element: <DashboardLayout />,
      children: [
        { path: configData.DASHBOARD_URL, element: <Dashboard /> },
        { path: configData.CREATE_GROUP_URL, element: <CreateGroup /> },
        { path: configData.ADD_EXPENSE_ROUTER_URL, element: <AddExpense /> },
        { path: configData.EDIT_EXPENSE_ROUTER_URL, element: <EditExpense /> },
        { path: configData.VIEW_EXPENSE_ROUTER_URL, element: <ViewExpense /> },
        { path: configData.USER_GROUPS_URL, element: <Group /> },
        { path: configData.VIEW_GROUP_ROUTER_URL, element: <ViewGroup /> },
        { path: configData.EDIT_GROUP_ROUTER_URL, element: <EditGroup /> },
        {
          path: `${configData.DASHBOARD_HOME_URL}${configData.ABOUT_URL}`,
          element: <About />,
        },
        { path: configData.USER_PROFILE_URL, element: <Profile /> },
      ],
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Login /> },
        { path: configData.LOGIN_URL, element: <Login /> },
        { path: configData.REGISTER_URL, element: <Register /> },
        { path: configData.USER_DELETED_URL, element: <PageUserDeleted /> },
        { path: configData.ABOUT_URL, element: <About /> },
      ],
    },
    { path: '*', element: <Page404 /> },
  ]);
}
