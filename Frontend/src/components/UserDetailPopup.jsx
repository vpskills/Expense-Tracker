import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Settings, LogOut } from 'lucide-react';
import { logout } from '../store/slices/authSlice';

const UserDetailPopup = ({ profileWindowOpen, setProfileWindowOpen, toggleRef }) => {
  const { userData } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const popupRef = useRef(null);

  const logoutUser = () => {
    localStorage.clear();
    dispatch(logout());
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setProfileWindowOpen(false);
      }
    }

    if (profileWindowOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileWindowOpen, setProfileWindowOpen, toggleRef]);

  return (
    <div
      ref={popupRef}
      className={`${
        profileWindowOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      } origin-bottom-right min-w-64 absolute -top-[17.5rem] right-4 transition-all duration-200 ease-out flex flex-col border border-neutral-700/50 bg-gradient-to-br from-neutral-800 to-neutral-900 backdrop-blur-sm rounded-xl shadow-2xl shadow-black/25 overflow-hidden`}
    >
      {/* Header with user info */}
      <div className="p-4 bg-gradient-to-r from-neutral-700/30 to-transparent border-b border-neutral-700/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="font-medium text-neutral-100 text-sm leading-tight">
              {userData?.name || 'User Name'}
            </div>
            <div className="text-xs text-emerald-400 font-medium">
              {userData?.email || 'user@example.com'}
            </div>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="p-2">
        {/* Profile option */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-neutral-700/50 transition-colors cursor-pointer group">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-700/50 group-hover:bg-neutral-600/50 transition-colors">
            <User className="w-4 h-4 text-neutral-300" />
          </div>
          <span className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
            View Profile
          </span>
        </div>

        {/* Settings option */}
        <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-neutral-700/50 transition-colors cursor-pointer group">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-700/50 group-hover:bg-neutral-600/50 transition-colors">
            <Settings className="w-4 h-4 text-neutral-300" />
          </div>
          <span className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
            Settings
          </span>
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-neutral-700/50"></div>

        {/* Logout button */}
        <div
          onClick={logoutUser}
          className="flex items-center gap-3 p-2.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 transition-all cursor-pointer group shadow-lg shadow-rose-900/20"
        >
          <div className="w-8 h-8 flex items-center justify-center">
            <LogOut className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPopup;
