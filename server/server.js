const express = require('express');    // Il framework per costruire il server e le API.
const cookieParser = require('cookie-parser');
const cors = require('cors');          // Il meccanismo che permette al server in ascolto su 5001 di poter accettare richieste dalla porta 3000, cioè dal client React
require('dotenv').config();      //legge il file `.env`, e permette di accedere alle variabili al suo interno inizializzando un processo in Node.js attraverso `process.env.nome_variabile`
const connectdb = require("./controllers/connect_db_controller")
// Importa il file delle rotte
const authRouter = require('./routes/authRouter');

const app = express(); // Creiamo un'istanza del nostro server Express.
const PORT = 5001; // Definiamo la porta su cui ascolterà.

app.use(cors({
    origin: 'http://localhost:3000', // È una buona pratica specificare l'origine
    credentials: true                // 2. Permette l'invio di cookie cross-origin
}));
app.use(express.json());  // Questo è FONDAMENTALE. Permette al server di capire i dati in formato JSON inviati dal frontend. Senza questo, req.body sarebbe indefinito.
// in questo modo impostiamo le regole generali per tutte le richieste in arrivo.

app.use(cookieParser()) // questo permette al server di leggere il token dal cookie presente nelle richieste successive del client dopo la fase di login

app.use('/api', authRouter)  //in questo modo gestisco login e registrazione ai link /api/login e /api/registration (raggiungibili solo da post)

connectdb();




app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});

