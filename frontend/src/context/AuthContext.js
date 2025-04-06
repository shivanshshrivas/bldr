'use client';

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userId, setUserId] = useState('a123b456');
    const [password, setPassword] = useState('');
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [activeSchedule, setActiveSchedule] = useState(null);
    const [activeSemester, setActiveSemester] = useState(null);
    const [activeScheduleName, setActiveScheduleName] = useState(null);

    return (
        <AuthContext.Provider value={{ userId, setUserId, password, setPassword, selectedClasses, setSelectedClasses, activeSchedule, setActiveSchedule, activeSemester, setActiveSemester, activeScheduleName, setActiveScheduleName }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
}