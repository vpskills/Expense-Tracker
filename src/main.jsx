import { createRoot } from 'react-dom/client';
import reduxStore from './store/store.js';
import { Provider } from "react-redux";
import './index.css';
import App from './App.jsx';
import AuthWrapper from './components/AuthWrapper.jsx';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: (
          <AuthWrapper>
            <Home />
          </AuthWrapper>
        ),
      },
      {
        path: 'login',
        element: (
          <AuthWrapper authenticate={false}>
            <Login />
          </AuthWrapper>
        ),
      },
      // {
      //   path: 'signup',
      //   element: (
      //     <AuthWrapper authenticate={false}>
      //       <Signup />
      //     </AuthWrapper>
      //   ),
      // },
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <Provider store={reduxStore}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </Provider>
);
