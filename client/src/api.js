//uso axios per interecettare una risposta 401 Unauthorized (token scaduto) per refreshare il token
import axios from "axios";
const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true //ogni richiesta fatta con axios includerà automaticamente i cookie (utile per inviare il refresh-token tramite i cookie)
})

// Intercettore che in caso di risposta 401 Unauthorized refresha il token
api.interceptors.response.use(
    (response) => response, //Se la risposta è OK, non fare nulla
    async (error) => {
        const originalRequest = error.config;

        // Se l'errore è 401 (Unauthorized) e non è un tentativo di retry
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marca come tentativo di retry

            try {
                // Fai la chiamata per ottenere un nuovo access token
                const response = await api.post('http://localhost:5001/api/auth/refresh');
                const accessToken = response.data;

                //aggiorno l'accessToken nel localStorage
                const user = JSON.parse(localStorage.getItem('user'));
                user.accessToken = accessToken;
                localStorage.setItem('user', JSON.stringify(user));


                // AGGIORNA IL TOKEN NEGLI HEADER DI DEFAULT DELLA TUA ISTANZA API
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

                // Aggiorna anche l'header della richiesta originale che stai per ritentare
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // Salva il nuovo token nello stato globale (es. AuthContext)
                // authContext.setToken(newAccessToken);

                // Se il refresh ha successo, ritenta la richiesta originale
                return api(originalRequest);
            } catch (refreshError) {
                // Se anche il refresh fallisce (refresh-token scaduto), crea un evento "logout-event" che verrà catturato da App.js che eseguirà logout()
                window.dispatchEvent(new CustomEvent('logout-event'));
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Interceptor per aggiungere l'accessToken a OGNI richiesta
api.interceptors.request.use(
    (config) => {
        //Recupera il token
        const user = JSON.parse(localStorage.getItem('user'));
        const accessToken = user?.accessToken; // Assumendo che il token sia salvato qui

        if (accessToken) {
            // Se il token esiste, aggiungilo agli header
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;