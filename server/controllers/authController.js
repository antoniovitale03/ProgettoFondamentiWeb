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
        const { username, email } = req.body;

        //controllo email esistente
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json("Email già in uso.");
        }

        //controllo username esistente
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json('Username già in uso.');
        }

        //se l'email e l'username non esistono ancora, invia alla mail il codice di verifica

        await sendMail(username, email, code);

        res.status(201).json({ message: 'Utente registrato con successo!' });

    } catch (error) {
        return res.status(500).json({ message: 'Errore del server.'});
    }
};

exports.verifycode = async (req, res) => {
    try{
        const {username, email, password, verificationCode } = req.body;

        //controlla se il codice inserito dall'utente(verificationCode) corrisponde a quello inviato via mail(code)
        if (verificationCode !== code) { //codice errato
            return res.status(500).json( 'Codice di verifica errato.');
        }
        //se il codice di verifica è corretto, puoi salvare l'utente nel DB
        //eseguo hash with salt della password
        const salt = await bcrypt.genSalt(10); // Genera un "sale" per la sicurezza
        const hashedPassword = await bcrypt.hash(password, salt); // Crea l'hash
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(200).json("Codice di verifica corretto. Ora sarai reindirizzato alla pagina di login.")
        }
    catch(error){
        return res.status(500).json('Errore del server.')
        }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Trova l'utente nel DB tramite il suo username e confronta la password fornita dall'utente con quella hashata nel DB

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json('Credenziali non valide.')
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json('Credenziali non valide.')
        }

        //Se l'utente e la password sono validi, crea un accessToken a breve scadenza (es. 15 minuti)
        //ma prima di tutto si costruisce il payload che contiene i dati dell'utente
        const payload = {
            user: {
                id: user._id,
                username: user.username,
                email: user.email

            } // Includo nel payload anche l'ID dell'utente nel token (quello che c'è nel DB)
        };
        // Firma il token con un segreto e imposta una scadenza
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1h"})

        //ora creiamo il refreshToken a lunga scadenza (es. 7 giorni), dopo la quale l'utente viene sloggato dal sistema
        //il ruolo del refreshToken è di aggiornare e dare al front end un nuovo accessToken ogni volta che ne scade uno
        // per permetterea all'utente di restare loggato e non fare login ogni 15 minuti
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"})

        //salvo il refreshtoken nel db
        user.refreshToken = refreshToken;
        await user.save();


        //inserisco il refreshtoken nel cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,// 7 giorni in ms
            path: '/api/auth/refresh' //il refreshtoken viene inviato in un percorso sicuro
        })

        //uso http o https in base al contesto. Nel contesto di sviluppo (locale), NODE_ENV = "development" quindi secure:false (HTTP), mentre
        //nel contesto di produzione (online), NODE_ENV = "production" quindi secure:true (HTTPS)

        // Invia una risposta di successo con solo i dati dell'utente (ma senza il token)
        //il campo user corrisponde alla variabile user che viene salvata nel contesto (lato Front end)
        res.status(200).json({
                id: user._id,
                username: user.username,
                email: user.email,
                accessToken: accessToken //inviamo l'accessToken nella richiesta per poterlo eventualmente salvare nel contesto
        });
    } catch (error) {
        res.status(500).json('Errore del server.');
    }
};

exports.refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({message: 'Refresh token non esistente. L utente deve loggarsi di nuovo.'});
    }

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({message: "Il refresh token non corrisponde a nessun utente"})

    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (payload.id !== user._id) return res.status(403).json({message: "Errore nella verifica del refreshtoken"})

    const newAccessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    );
    res.json({ newAccessToken }); //token aggiornato

}

exports.forgotPassword = async (req, res) => {
    try {
        const {username, oldPassword, newPassword, confirmNewPassword} = req.body;

        //prima controllo che lo username esista
        const user = await User.findOne({username})
        if (!user) {
            return res.status(400).json("L'utente non esiste")
        }

        //poi controllo che la password inserita in "vecchia password" corrisponda a quella dell'utente
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch){
            return res.status(400).json("La vecchia password non è corretta. ")
        }

        //dopodichè controllo che la nuova password e la sua conferma siano uguali
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json( 'Le password non corrispondono.');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json('Password aggiornata con successo.');
    }catch (error) {
        res.status(500).json('Errore del server.');
    }
}

exports.logout = async (req, res) => { //il server invia al client un cookie già scaduto, così il client automaticamente lo cancellerà
    try {
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: 'Logout effettuato con successo.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Errore del server.' });
    }

}

exports.deleteAccount = async (req, res) => {
    try{
        const userID = req.user.id; //prendo l'id dell'utente dall'oggetto user che ricevo dal middleware verifyJWT (essendo l'utente loggato possiamo prelevare i suoi dati dal token contenuto nel cookie della richiesta)
        await User.findByIdAndDelete(userID);

        // 3. Cancella anche il cookie di sessione per completare il logout
        res.cookie('token', '', { httpOnly: true, expires: new Date(0) });

        res.status(200).json("Account eliminato con successo." );
    } catch(error){
        res.status(500).json('Errore del server.');
    }
}
