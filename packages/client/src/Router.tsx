import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from './guards';
import Home from './pages/Home';
import Login from './pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <Home />
      </AuthGuard>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <>404 Page not found</>,
  },
]);

export default router;
