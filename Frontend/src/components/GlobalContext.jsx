import { createContext, useContext, useEffect, useState } from 'react';

const GlobalContext = createContext();

const useGlobalContextHook = () => {
  const [profileWindowOpen, setProfileWindowOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [calenderType, setCalendarType] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return {
    profileWindowOpen,
    setProfileWindowOpen,
    formVisible,
    setFormVisible,
    calenderType,
    setCalendarType,
    selectedDate, 
    setSelectedDate,
    darkMode,
    setDarkMode
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
