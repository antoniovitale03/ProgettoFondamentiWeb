require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routers/authRouter');
const filmRouter = require('./routers/filmRouter');
const userRouter = require('./routers/userRouter');

const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSW}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

const app = express();

//il server può accettare richieste HTTP (che possono includere cookie) da un'origine specifica
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

//il server può leggere e interpretare i dati in JSON che riceve dal front end (ad esempio con req.body)
app.use(express.json({limit: '50mb'}));

//il server può leggere i dati inviati tramite cookie (ad esempio con req.cookies.refreshtoken)
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/films', filmRouter);


mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connesso con successo!'))
    .catch(error => console.error('Errore di connessione a MongoDB:', error.message))


app.listen(PORT, () => console.log(`Server in esecuzione sulla porta ${PORT}`));

