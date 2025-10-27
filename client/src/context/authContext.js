import React, {createContext, useState, useContext, useEffect} from 'react';
import api from "../api";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
    //converto l'oggetto JSON in oggetto JS per poterlo salvare nella variabile di stato

    const navigate = useNavigate();
    // Funzione per pulire lo stato e localStorage al logout
    const logout = async () => {
            await api.get(`${process.env.REACT_APP_SERVER}/api/auth/logout`);
            setUser(null);
            navigate("/");
    };

    // Ogni volta che viene modificato user (es. dopo il login o logout), aggiorno anche localStorage
    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user)); //trasformo l'oggetto JS in un JSON per ptoerlo salvare nel localStorage
        else localStorage.removeItem("user");
    }, [user]);


    return <AuthContext.Provider value={{user, setUser, logout, isLoggedIn: Boolean(user)}}>
        {children}
    </AuthContext.Provider>; // children è la componente App
}

// Custom hook per un accesso facilitato
export function useAuth() {
    return useContext(AuthContext)
}
