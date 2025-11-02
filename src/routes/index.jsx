import React from 'react';
import { createRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import Checkout from '../pages/Checkout';

const Index = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/checkout',
      element: <Checkout />,
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Index;