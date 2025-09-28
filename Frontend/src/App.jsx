import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Outlet } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';
import { useGlobalContext } from './components/GlobalContext';
import { isMobile } from 'react-device-detect';
import BottomNavigation from './components/BottomNavigation';
import UserDetailPopup from './components/UserDetailPopup';

function App() {
  const { isLoading } = useAuth();
  const { profileWindowOpen, setProfileWindowOpen, formVisible, setFormVisible } = useGlobalContext();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen text-gray-400 bg-neutral-900">
        <CircleLoader color="white" />
        <h2>Checking session</h2>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 h-screen overflow-y-auto overflow-x-hidden custom-scroll relative">
      <Toaster
        toastOptions={{
          style: {
            fontFamily: 'Montserrat',
            fontWeight: '500',
            fontSize: '14px',
          },
        }}
      />
      <Outlet />
      {isMobile && (
        <div className="md:hidden fixed bottom-0 inset-x-0 p-3 px-5 bg-neutral-900 z-20">
          <BottomNavigation
            setProfileWindowOpen={setProfileWindowOpen}
            profileWindowOpen={profileWindowOpen}
            formVisible={formVisible}
            setFormVisible={setFormVisible}
          />
          <UserDetailPopup profileWindowOpen={profileWindowOpen} />
        </div>
      )}
    </div>
  );
}

export default App;
