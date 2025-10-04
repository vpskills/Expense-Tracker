import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { Outlet } from 'react-router-dom';
import { CircleLoader } from 'react-spinners';
import { useGlobalContext } from './components/GlobalContext';
import { isMobile } from 'react-device-detect';
import BottomNavigation from './components/BottomNavigation';
import UserDetailPopup from './components/UserDetailPopup';
import { useSelector } from 'react-redux';
import { useRef } from 'react';

function App() {
  const { isLoading } = useAuth();
  const isLogged = useSelector((state) => state.auth.status);
  const { profileWindowOpen, setProfileWindowOpen, formVisible, setFormVisible } = useGlobalContext();
  const toggleRef = useRef(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-screen text-gray-400 bg-neutral-900">
        <CircleLoader color="white" />
        <h2>Checking session</h2>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 h-screen overflow-y-auto overflow-x-hidden custom-scroll relative">
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
      {isMobile && isLogged && (
        <div className="md:hidden fixed bottom-0 inset-x-0 p-1.5 px-5 bg-neutral-900 z-20">
          <BottomNavigation
            ref={toggleRef}
            setProfileWindowOpen={setProfileWindowOpen}
            profileWindowOpen={profileWindowOpen}
            formVisible={formVisible}
            setFormVisible={setFormVisible}
          />
          <UserDetailPopup profileWindowOpen={profileWindowOpen} setProfileWindowOpen={setProfileWindowOpen} toggleRef={toggleRef}/>
        </div>
      )}
    </div>
  );
}

export default App;
