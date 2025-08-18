const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
//codice di verifica casuale a 6 cifre
const code = Math.floor(100000 + Math.random() * 900000).toString();

async function sendMail(username, email, code) {
    //attivo la password per le app nell'account google per poter inviare mail da av715... con nodemailer
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.email,
            pass: process.env.passw,
        },
    });
    await transporter.sendMail({
        from: process.env.email,
        to: email,
        subject: `CODICE DI VERIFICA`,
        text: `Ciao ${username}, grazie per esserti registrato! Il codice di verifica è: ${code}`,
        html: `<p>Ciao ${username}, grazie per esserti registrato!</p><p>Il tuo codice di verifica è: <strong>${code}</strong></p>`
    });
}

//registro i dati temporaneamente in DB e poi verifico il codice, se è errato elimino i dati dal DB
exports.registerdata = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //controllo email esistente
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'Email già in uso.' });
        }

        //controllo username esistente
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Username già in uso.' });
        }

        //eseguo hash with salt della password
        const salt = await bcrypt.genSalt(10); // Genera un "sale" per la sicurezza
        const hashedPassword = await bcrypt.hash(password, salt); // Crea l'hash
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        await sendMail(username, email, code);

        return res.status(201).json({ message: 'Utente registrato con successo!' });

    } catch (error) {
        return res.status(500).json({ message: 'Errore del server.'});
    }
};

exports.verifycode = async (req, res) => {
    try{
        const {email, verificationCode } = req.body;

        if (verificationCode !== code) { //codice errato
            return res.status(500).json({ message: 'Codice di verifica errato.'});
        }
        return res.status(200).json({message: "Codice di verifica corretto. Ora sarai reindirizzato alla pagina di login."})
        }
    catch(error){
        return res.status(500).json({ message: 'Errore del server.' })
        }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Trova l'utente nel DB tramite il suo username e confronta la password fornita dall'utente con quella hashata nel DB

        const user = await User.findOne({username});
        if (!user) {
            return res.status(400).json({ message: 'Credenziali non valide.' })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({ message: 'Credenziali non valide.' })
        }

        //Se l'utente e la password sono validi, crea un Token JWT
        //prima di tutto si costruisce il payload che contiene i dati dell'utente
        const payload = {
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            } // Includo nel payload anche l'ID dell'utente nel token (quello che c'è nel DB)
        };
        // Firma il token con un segreto e imposta una scadenza
        const token = jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: "1h"})

        //Sessione stateful: si inserisce il token non in JSON nella risposta ma in un header Set-Cookie

        res.cookie('token', token, {
            httpOnly: true, // Il cookie non è accessibile via JS (quindi neanche da React), può essere scambiato solo attraverso HTTP
            secure: process.env.NODE_ENV === 'production', // Usa HTTPS in produzione
            maxAge: 3600000 // Scadenza in millisecondi (1 ora)
        });

//uso http o https in base al contesto. Nel contesto di sviluppo (locale), NODE_ENV = "development" quindi secure:false (HTTP), mentre
//nel contesto di produzione (online), NODE_ENV = "production" quindi secure:true (HTTPS)

        // Invia una risposta di successo con solo i dati dell'utente (ma senza il token)
        //il campo user corrisponde alla variabile user che viene salvata nel contesto (lato Front end)
        res.status(200).json({
            message: "Login riuscito",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Errore del server.' });
    }
};

exports.forgotPassword = async (req, res) => {
    const {username, password, confirmPassword} = req.body;
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Le password non corrispondono.' });
    }

    //trovo l'utente con quel username
    const user = await User.findOne({ username: username })
    if (!user) {
        return res.status(400).json({ message: "L'utente non esiste" })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(confirmPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password aggiornata con successo.' });
    }

exports.logout = async (req, res) => { //cancella il cookie
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0) // il server invia al client un cookie già scaduto, che automaticamente scarterà
        });
        res.status(200).json({ message: 'Logout effettuato con successo.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Errore del server.' });
    }

}

exports.checkUser = async(req, res) => {
    try {
        // Grazie al middleware, 'req.user' ora esiste e contiene { id: '...' }
        // Usiamo l'ID per trovare i dati completi dell'utente, escludendo la password.
        const userProfile = await User.findById(req.user.id).select('-password');

        if (!userProfile) {
            return res.status(404).json({ message: 'Profilo utente non trovato.' });
        }
        res.status(200).json(userProfile);
    } catch (error) {
        console.error("Errore nel recuperare il profilo:", error);
        res.status(500).json({ message: 'Errore interno del server.' });
    }
}