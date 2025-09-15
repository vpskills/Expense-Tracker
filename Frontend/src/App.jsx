import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Outlet } from 'react-router-dom';

function App() {
  const { isLoading, data, error } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-svh text-gray-400">
        Checking session...
      </div>
    );
  }
  
  return (
    // <ExpenseTracker/>
    <div className="bg-neutral-900 min-h-svh">
      <Toaster />
      <Outlet />
    </div>
  );
}

export default App;
