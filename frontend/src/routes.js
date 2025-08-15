import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login from './components/auth/Login.js';
import Register from './components/auth/Register.js';
import GroupList from './components/groups/GroupList.js';
import GroupDetail from './components/groups/GroupDetail.js';
import BudgetChart from './components/analytics/BudgetChart.js';
import CategoryChart from './components/analytics/CategoryChart.js';
import Leaderboard from './components/analytics/Leaderboard.js';

function ProtectedRoute({ children }) {
  const tokens = useSelector((s) => s.auth.tokens);
  if (!tokens)
    return React.createElement(Navigate, { to: '/login', replace: true });
  return children;
}

export default function AppRoutes() {
  return React.createElement(
    Routes,
    null,
    React.createElement(Route, {
      path: '/login',
      element: React.createElement(Login),
    }),
    React.createElement(Route, {
      path: '/register',
      element: React.createElement(Register),
    }),
    React.createElement(Route, {
      path: '/',
      element: React.createElement(
        ProtectedRoute,
        null,
        React.createElement(GroupList),
      ),
    }),
    React.createElement(Route, {
      path: '/groups/:id',
      element: React.createElement(
        ProtectedRoute,
        null,
        React.createElement(GroupDetail),
      ),
    }),
    React.createElement(Route, {
      path: '/analytics/budget',
      element: React.createElement(
        ProtectedRoute,
        null,
        React.createElement(BudgetChart),
      ),
    }),
    React.createElement(Route, {
      path: '/analytics/categories',
      element: React.createElement(
        ProtectedRoute,
        null,
        React.createElement(CategoryChart),
      ),
    }),
    React.createElement(Route, {
      path: '/analytics/leaderboard',
      element: React.createElement(
        ProtectedRoute,
        null,
        React.createElement(Leaderboard),
      ),
    }),
  );
}
