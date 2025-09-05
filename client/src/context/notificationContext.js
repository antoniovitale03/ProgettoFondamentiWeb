//contesto per la gestione delle notifiche (pop up) all'interno dell'app
import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';


const NotificationContext = createContext(null);


export function NotificationProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'

    // Funzione per mostrare la notifica
    const showNotification = (newMessage, newSeverity) => {
        setMessage(newMessage);
        setSeverity(newSeverity);
        setOpen(true);
    };

    // Funzione per chiudere la notifica
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    // Il valore fornito dal context
    const value = { showNotification };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <Snackbar
                open={open}  //aperto o chiuso
                autoHideDuration={4000} // Si chiude dopo 4 secondi
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }} // Posizione
            >
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
}


export function useNotification() {
    return useContext(NotificationContext);
}