import Calendar from './components/Calendar';
import ExpenseTracker from './components/ExpenseTracker';
import { useAuth } from './hooks/useAuth';
import Home from './Pages/Home';
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
      <Outlet />
    </div>
  );
}

export default App;
