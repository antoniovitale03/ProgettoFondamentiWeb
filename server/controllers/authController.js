const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendMail(username, email) {

    //codice di verifica casuale a 6 cifre
    const code = Math.floor(100000 + Math.random() * 900000).toString();
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
    return code
}

exports.registerData = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //controllo email esistente
        if (await User.findOne({ email })) return res.status(400).json("Email già in uso.");

        //controllo username esistente
        if (await User.findOne({ username })) return res.status(400).json('Username già in uso.');

        //se l'email e l'username non esistono ancora, invia alla mail il codice di verifica
        const verificationCode = await sendMail(username, email);

        const salt = await bcrypt.genSalt(10); // Genera un "sale" per la sicurezza
        const hashedPassword = await bcrypt.hash(password, salt); // Crea l'hash
        const expiresAt = new Date(Date.now() + 300 * 1000); // scade in 5 minuti

        //salvo username email code in pending_user
        const pendingUser = await PendingUser.findOneAndUpdate(
            { email },
            {
                $set: {
                    username: username,
                    hashedPassword: hashedPassword,
                    verificationCode: verificationCode,
                    expiresAt: expiresAt,
                }
                },
            { upsert: true, new: true }
        );
        await pendingUser.save();

        res.status(200).json('Utente salvato momentaneamente. Controlla la tua email per il codice di verifica.');

    } catch (error) {
        return res.status(500).json('Errore del server.');
    }
};

exports.registrationVerify = async (req, res) => {
    try{
        const { email, verificationCode } = req.body;

        const pendingUser = await PendingUser.findOne({ email });
        if(!pendingUser) return res.status(400).json('Utente non trovato.');

        if (pendingUser.expiresAt < new Date()) {
            await PendingUser.deleteOne({ email });
            return res.status(400).json('Codice scaduto.');
        }

        if (pendingUser.verificationCode !== verificationCode) {
            return res.status(400).json('Codice di verifica errato.');
        }

        // Salvo permanentemente
        const newUser = new User({
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.hashedPassword
        });
        await newUser.save();

        // Rimuovo l'utente temporaneo
        await PendingUser.deleteOne({ email });

        res.status(200).json("Codice di verifica corretto. Ora sarai reindirizzato alla pagina di login.")
        }
    catch(error){
        return res.status(500).json('Errore del server.')
        }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trova l'utente nel DB tramite il suo username e confronta la password fornita dall'utente con quella hashata nel DB

        const user = await User.findOne({ email: email });
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

            }
        };
        // Creo i due token
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "15m"}) // verrà salvato nella memoria locale del browser
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"}) // verrà salvato nel DB

        //salvo il refreshtoken nel DB nel documento utente
        user.refreshToken = refreshToken;
        await user.save();

        //in questo modo il browser potrà inserire il refreshtoken nel cookie solo quando fa richiesta a /api/auth/refresh
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,// 7 giorni in ms
            path: '/api/auth/refresh'
        })

        //uso http o https in base al contesto. Nel contesto di sviluppo (locale), NODE_ENV = "development" quindi secure:false (HTTP), mentre
        //nel contesto di produzione (online), NODE_ENV = "production" quindi secure:true (HTTPS)

        // Invia come riposta i dati dell'utente + accessToken (da salvare nel contesto)
        res.status(200).json({
                id: user._id,
                username: user.username,
                email: user.email,
                accessToken: accessToken //inviamo l'accessToken nella richiesta per poterlo eventualmente salvare nel localStorage del browser
        });
    } catch (error) {
        res.status(500).json('Errore del server.');
    }
};

exports.forgotPassword = async (req, res) => {
    try{
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if(!user){
            return res.status(404).json("utente non esistente");
        }
        const code = await sendMail(user.username, email);
        const expiresAt = new Date(Date.now() + 300 * 1000); // scade in 300s (5min)
        //creo un utente temporaneo solo con le info essenziali per questa fase
        const pendingUser = await PendingUser.findOneAndUpdate(
            { email },
            { $set: { verificationCode: code, expiresAt: expiresAt  } },
            { upsert: true, new: true }
        );
        await pendingUser.save();
        res.status(200).json("Email inviata");
    }catch(error){
        res.status(500).json('Errore del server.');
    }
}

exports.loginVerify = async (req, res) => {
    const { email, verificationCode } = req.body;
    const pendingUser = await PendingUser.findOne({ email });
    if(!pendingUser) return res.status(400).json('Utente non trovato.');

    if (pendingUser.expiresAt < new Date()) {
        await PendingUser.deleteOne({ email });
        return res.status(400).json('Codice scaduto.');
    }

    if(pendingUser.verificationCode !== verificationCode) {
        return res.status(400).json("Codice di verifica non corretto.");
    }else{
        await PendingUser.deleteOne({ email });
        return res.status(200).json("Codice di verifica corretto");
    }
}

exports.setNewPassword = async (req, res) => {
    try{
        const {email, newPassword, confirmNewPassword} = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json("L' utente non esiste");
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

    }catch(error){
        res.status(500).json('Errore del server.');
    }
}

exports.refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json('Refresh token non esistente. L utente deve loggarsi di nuovo.');

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json("Il refresh token non corrisponde a nessun utente")


    let payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (payload.user.id !== user._id.toString()) return res.status(403).json("Errore nella verifica del refreshtoken")
    payload = { user: payload.user }; //elimino i campi iat ed exp generati automaticamente da jwt dopo la verifica

    const newAccessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
    res.json(newAccessToken); //token aggiornato
}

exports.logout = async (req, res) => {
    //devo invalidare il refreshToken eliminandolo dal DB e dal browser
    // il server non gestisce l'access token, per cui il frontend dopo aver
    // eseguito questa API chiama setUser(null), invalidando di fatto l'access token (che è salvato
    // nel contesto)
    try {
        const userID = req.user.id;

        await User.findByIdAndUpdate(userID,
            {$set: {refreshToken: " "}
            });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,// 7 giorni in ms
            path: '/api/auth/refresh'
        })

        res.status(200).json('Logout effettuato con successo.');
    }
    catch (error) {
        res.status(500).json('Errore del server.');
    }

}

