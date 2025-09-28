import React, { forwardRef } from 'react';
import { HomeIcon, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BottomNavigation = forwardRef(({
  setFormVisible,
  formVisible,
  profileWindowOpen,
  setProfileWindowOpen,
}, ref) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between w-full items-center relative">
      <HomeIcon
        onClick={() => navigate('/')}
        size={25}
        strokeWidth={2.5}
        className="text-neutral-500"
      />
      <div
        onClick={() => setFormVisible(!formVisible)}
        className={`transition-all duration-300 ${
          formVisible ? 'rotate-45 text-rose-500' : 'text-neutral-400'
        } bg-gradient-to-r from-neutral-800 to-neutral-700 bg-neutral-800 rounded-full p-1`}
      >
        <Plus size={40} />
      </div>
      <User
        ref={ref}
        onClick={() => setProfileWindowOpen(!profileWindowOpen)}
        size={25}
        strokeWidth={2.5}
        className="text-neutral-500"
      />
    </div>
  );
});

export default BottomNavigation;
