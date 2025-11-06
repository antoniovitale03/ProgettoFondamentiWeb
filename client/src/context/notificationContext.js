import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'

    const showNotification = (newMessage, newSeverity) => {
        setMessage(newMessage);
        setSeverity(newSeverity);
        setIsOpen(true);
    };

    // Funzione per chiudere la notifica
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setIsOpen(false);
    };


    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar open={isOpen} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
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