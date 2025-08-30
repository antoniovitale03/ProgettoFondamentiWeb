import React, {createContext, useState, useContext} from 'react';
// Crea il contesto. Ogni componente figlio di App dovrà esportare una o più variabili/funzioni usando il contesto
//appena creato (inizialmente nullo), a patto che il componente sia incapsulato in App e qui in AuthProvider che fornisce
//le variabili e funzioni
const AuthContext = createContext(null);

//usiamo la variabile di stato user per verificare lo stato di login durante la sessione di uso dell'app, ma per rendere
//persistente lo  stato anche dopo la chiusura del browser si usa localStorage

//N.B. la variabile di stato è JS, ma quella salvata in localstorage è JSON

// Crea il componente Provider che incapsula tutti le funzioni e variabili da condividere tra i componenti figli
export function AuthProvider({ children }) {
    // Stato "user"
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user'))) //converte l'oggetto JSON in JS
    // Funzione per aggiornare lo stato e localStorage al login


     const registerData = async (username, email) => {
         const response = await fetch('http://localhost:5001/api/auth/registration/data', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ username, email }),
         });
         const data = await response.json();
         if (!response.ok) {
             const error = data.message;
             throw new Error(error);
         }
     }

     const verifyCode = async (username, email, password, verificationCode) => {
         const response = await fetch('http://localhost:5001/api/auth/registration/verify', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ username, email, password, verificationCode }), // Invia l'email per identificare l'utente
         });
         const data = await response.json();
         if (!response.ok) {
             const error = data.message;
             throw new Error(error);
         }
     }

    const login = async (username, password) => {
            const response = await fetch('http://localhost:5001/api/auth/login', {
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

            // Se la chiamata API ha successo, aggiorna lo stato e localStorage
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));

    };

    const forgotPassword = async (username, oldPassword, newPassword, confirmNewPassword) => {
        const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, oldPassword, newPassword, confirmNewPassword })
        })
        const data = await response.json();
        if (!response.ok) {
            const error = data.message;
            throw new Error(error)
        }
    };

    // Funzione per pulire lo stato e localStorage al logout
    const logout = async () => {
        const response = await fetch('http://localhost:5001/api/auth/logout', {
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
    };

    const deleteAccount = async(confirmEmail) => {
        const trueEmail = user.email //trueEmail è l'effettiva mail dell'utente e la confronto con quella appena inserita
        if (trueEmail !== confirmEmail) {
            throw new Error("L'email non corrisponde a quella del tuo account. Riprova");
        }

        //se l'email corrisponde, si procede ad eliminare l'utente (tramite chiamata API al server)
        const response = await fetch("http://localhost:5001/api/auth/delete-account", {
            method: "DELETE",
            credentials: 'include' // Invia il cookie per l'autenticazione
        });

        const data = await response.json();

        if (!response.ok) {
            const error = data.message;
            throw new Error(error);
        }
    }

    const sleep = (t) => new Promise(res => setTimeout(res, t))


    // Dati e funzioni che vogliamo rendere disponibili a tutta l'app
    const value = { user, registerData, verifyCode, login, logout, forgotPassword, deleteAccount, isLoggedIn: !!user, sleep};

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