import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

const useGlobalContextHook = () => {
  const [profileWindowOpen, setProfileWindowOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [calenderType, setCalendarType] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return {
    profileWindowOpen,
    setProfileWindowOpen,
    formVisible,
    setFormVisible,
    calenderType,
    setCalendarType,
    selectedDate, 
    setSelectedDate
  };
};

export function GlobalContextProvider({ children }) {
  return (
    <GlobalContext.Provider value={useGlobalContextHook()}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  return useContext(GlobalContext);
}
