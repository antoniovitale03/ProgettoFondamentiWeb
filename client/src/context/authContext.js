import React, {createContext, useState, useContext} from 'react';
import {useNavigate} from "react-router-dom";
// Crea il contesto. Ogni componente figlio di App dovrà esportare una o più variabili/funzioni usando il contesto
//appena creato (inizialmente nullo), a patto che il componente sia incapsulato in App e qui in AuthProvider che fornisce
//le variabili e funzioni
const AuthContext = createContext(null);


//usiamo la variabile di stato user per verificare lo stato di login durante la sessione di uso dell'app, ma per rendere
//persistente lo  stato anche dopo la chiusura del browser si usa localStorage

//N.B. la variabile di stato è JS, ma quella salvata in localstorage è JSON

// Crea il componente Provider che incapsula tutti le funzioni e variabili da condividere tra i componenti figli
export function AuthProvider({ children }) {
    const navigate = useNavigate();
    // Stato "user"
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user'))) //converte l'oggetto JSON in JS
    // Funzione per aggiornare lo stato e localStorage al login

    const registration = async (username, email, password) => {
            const response = await fetch('http://localhost:5001/api/registration', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, email, password}),  //i dati nel corpo della richiesta http devono essere in formato JSON, non JS
                credentials: "include"
            });
            const data = await response.json();
            if (!response.ok) {
                const error = data.message;
                throw new Error(error);
            }
    }

    const login = async (username, password) => {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            const data = await response.json(); //data è JSON, response è JS

            if (!response.ok) { //l'oggetto response sarà tipo {message: "Descrizione errore"}
                const error = data.message;
                // Se c'è un errore, lancialo per farlo gestire dal componente che ha chiamato
                throw new Error(error);
            }

            // Se la chiamata ha successo, aggiorna lo stato e localStorage
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Esegui il reindirizzamento
            navigate('/');
    };

    // Funzione per pulire lo stato e localStorage al logout
    const logout = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/logout', {
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            })
            if (!response.ok){
                throw new Error("Logout fallito")
            }

            //il server invierà un messaggio con cookie già scaduto, quindi viene scartato dal client

            setUser(null);
            localStorage.removeItem('user');

            navigate('/', {
                replace: true,
                state: { message: 'Logout effettuato con successo.' }
            });
        }
        catch(error){
            console.log(error)}
    };


    // Dati e funzioni che vogliamo rendere disponibili a tutta l'app
    const value = { user, registration, login, logout, isLoggedIn: !!user };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook per un accesso facilitato
export function useAuth() {
    const context = useContext(AuthContext)
    // Se un componente prova a usare questo hook senza essere un figlio
    // del Provider, 'context' sarà 'null'.
    if (context === null) {
        throw new Error("useAuth deve essere usato all'interno di un AuthProvider");
    }
    return context;
}