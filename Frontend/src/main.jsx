import { createRoot } from 'react-dom/client';
import reduxStore from './store/store.js';
import { Provider } from 'react-redux';
import './index.css';
import App from './App.jsx';
import AuthWrapper from './components/AuthWrapper.jsx';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Signup from './Pages/Signup.jsx';
import { GlobalContextProvider } from './components/GlobalContext.jsx';
import ExpenseDetailPage from './components/ListExpenses/ExpenseDetailPage.jsx';

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
      {
        path: 'signup',
        element: (
          <AuthWrapper authenticate={false}>
            <Signup />
          </AuthWrapper>
        ),
      },
      {
        path: 'expense/details/:expenseId',
        element: <ExpenseDetailPage/>
      }
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <GlobalContextProvider>
      <Provider store={reduxStore}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Provider>
    </GlobalContextProvider>
  </GoogleOAuthProvider>
);
