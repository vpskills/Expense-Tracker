import { createContext, useContext, useState } from 'react';

const GlobalContext = createContext();

const useGlobalContextHook = () => {
  const [profileWindowOpen, setProfileWindowOpen] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  return {
    profileWindowOpen,
    setProfileWindowOpen,
    formVisible,
    setFormVisible,
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
