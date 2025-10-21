require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Router
const authRouter = require('./routes/authRouter');
const filmRouter = require('./routes/filmRouter');
const userRouter = require('./routes/userRouter');

const app = express();

// Configurazione
const PORT = process.env.PORT;
const CLIENT_URL = process.env.CLIENT_URL;
const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSW}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

// Middleware
app.use(cors({
    origin: CLIENT_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(express.static('public')); // serve avatar, immagini, ecc.

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/films', filmRouter);

// Connessione a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connesso con successo!'))
    .catch((error) => {
        console.error('Errore di connessione a MongoDB:', error.message);
    });

// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

