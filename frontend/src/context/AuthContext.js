'use client';

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Helper to sync state with localStorage
  const usePersistedState = (key, initialValue) => {
    const [state, setState] = useState(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : initialValue;
      }
      return initialValue;
    });

    useEffect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(state));
      }
    }, [key, state]);

    return [state, setState];
  };


  //form data
  const [userId, setUserId] = usePersistedState("userId", "");
  const [password, setPassword] = usePersistedState("password", ""); 
  // const [unofficialTranscript, setUnofficialTranscript] = useState(null);
  const [catalogYear, setCatalogYear] = useState(null);
  const [major, setMajor] = useState(null);

  
  const [suggestedClasses, setSuggestedClasses] = useState([]);
  const [selectedClasses, setSelectedClasses] = usePersistedState("selectedClasses", []);
  const [schedules, setSchedules] = usePersistedState("schedules", []);
  const [activeSchedule, setActiveSchedule] = usePersistedState("activeSchedule", []);
  const [activeSemester, setActiveSemester] = usePersistedState("activeSemester", '');
  const [activeScheduleName, setActiveScheduleName] = usePersistedState("activeScheduleName", '');

  return (
    <AuthContext.Provider
      value={{
        userId,
        setUserId,
        password,
        setPassword,
        // unofficialTranscript,
        // setUnofficialTranscript,
        catalogYear,
        setCatalogYear,
        major,
        setMajor,
        suggestedClasses,
        setSuggestedClasses,
        selectedClasses,
        setSelectedClasses,
        schedules,
        setSchedules,
        activeSchedule,
        setActiveSchedule,
        activeSemester,
        setActiveSemester,
        activeScheduleName,
        setActiveScheduleName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
