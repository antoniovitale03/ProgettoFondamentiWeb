const express = require('express');    // Il framework per costruire il server e le API.
const cookieParser = require('cookie-parser');
const cors = require('cors');          // Il meccanismo che permette al server in ascolto su 5001 di poter accettare richieste dalla porta 3000, cioè dal client React
require('dotenv').config();      //legge il file `.env`, e permette di accedere alle variabili al suo interno inizializzando un processo in Node.js attraverso `process.env.nome_variabile`
const connectdb = require("./controllers/connectDBController")
const authRouter = require('./routes/authRouter');
const filmRouter = require('./routes/filmRouter');
const userRouter = require('./routes/userRouter');

const app = express(); // Creiamo un'istanza del nostro server Express.
const PORT = 5001; // Definiamo la porta su cui ascolterà.

// sfruttando il meccanismo cors, il server può accettare richieste dal front-end (localhost:3000), leggere i cookie nella richiesta
// e accettare determinati header
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));  // Permette al server di capire i dati in formato JSON inviati dal frontend. Senza questo, req.body sarebbe indefinito.
// in questo modo impostiamo le regole generali per tutte le richieste in arrivo.

app.use(express.urlencoded({ limit: '50mb', extended: true })); //usato per poter interpretare correttamente i dati inviati tramite i form

// Rendi la cartella 'public' accessibile, così il browser può vedere le immagini(per l'avatar)
app.use(express.static('public'));
app.use(cookieParser()) // permette al server di leggere l'accessToken dal cookie presente nelle richieste

app.use('/api/user', userRouter) // gestione dell'utente (rimozione accout, modifica profilo/password, ecc.)
app.use('/api/auth', authRouter)  //gestione dell'autenticazione
app.use('/api/films', filmRouter)  //gestione dei film

connectdb();


app.listen(PORT, () => {
    console.log(`Server in esecuzione sulla porta ${PORT}`);
});

