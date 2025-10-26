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


app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/films', filmRouter);


mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connesso con successo!'))
    .catch(error => console.error('Errore di connessione a MongoDB:', error.message))


app.listen(PORT, () => console.log(`Server in esecuzione sulla porta ${PORT}`));

