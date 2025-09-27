import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Outlet } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';

function App() {
  const { isLoading, data, error } = useAuth();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen text-gray-400 bg-neutral-900">
        <CircleLoader color='white'/>
        <h2>Checking session</h2>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 h-screen overflow-y-auto overflow-x-hidden custom-scroll">
      <Toaster
        toastOptions={{
          style: {
            fontFamily: 'Montserrat',
            fontWeight: '500',
            fontSize: '14px'
          },
        }}
      />
      <Outlet />
    </div>
  );
}

export default App;
