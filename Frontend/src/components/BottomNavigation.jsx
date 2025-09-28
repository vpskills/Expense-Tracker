import React from 'react';
import { HomeIcon, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BottomNavigation = ({
  setFormVisible,
  formVisible,
  profileWindowOpen,
  setProfileWindowOpen,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between w-full items-center relative">
      <HomeIcon
        onClick={() => navigate('/')}
        size={25}
        strokeWidth={2.5}
        className="text-neutral-500"
      />
      <Plus
        onClick={() => setFormVisible(!formVisible)}
        size={40}
        className={`transition-all bg-neutral-800 rounded-full p-1 ${
          formVisible ? 'rotate-45 text-rose-500' : 'text-neutral-400'
        }`}
      />
      <User
        onClick={() => setProfileWindowOpen(!profileWindowOpen)}
        size={25}
        strokeWidth={2.5}
        className="text-neutral-500"
      />
    </div>
  );
};

export default BottomNavigation;
