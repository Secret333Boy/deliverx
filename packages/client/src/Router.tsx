import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from './guards';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceDetails from './pages/InvoiceDetails';
import WorkerDetails from './pages/WorkerDetails';
import TrackGetting from './pages/TrackGetting';
import TrackGiving from './pages/TrackGiving';

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
    path: '/:screen',
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
    path: '/register',
    element: <Register />,
  },
  {
    path: '/create-invoice',
    element: (
      <AuthGuard>
        <CreateInvoice />
      </AuthGuard>
    ),
  },
  {
    path: '/invoice/:id',
    element: (
      <AuthGuard>
        <InvoiceDetails />
      </AuthGuard>
    ),
  },
  {
    path: '/worker/:id',
    element: (
      <AuthGuard>
        <WorkerDetails />
      </AuthGuard>
    ),
  },
  {
    path: '/track/getting',
    element: (
      <AuthGuard>
        <TrackGetting />
      </AuthGuard>
    ),
  },
  {
    path: '/track/giving',
    element: (
      <AuthGuard>
        <TrackGiving />
      </AuthGuard>
    ),
  },
  {
    path: '*',
    element: <>404 Page not found</>,
  },
]);

export default router;
