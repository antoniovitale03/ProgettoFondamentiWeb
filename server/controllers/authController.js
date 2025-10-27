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

        if (await User.findOne({ email })) return res.status(400).json("Email già in uso.");

        if (await User.findOne({ username })) return res.status(400).json('Username già in uso.');

        const verificationCode = await sendMail(username, email);
        const expiresAt = new Date(Date.now() + 300 * 1000); // il codice ha scadenza di 5 minuti

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        await PendingUser.findOneAndUpdate(
            { email },
            {
                $set: {
                    username: username,
                    hashedPassword: hashedPassword,
                    verificationCode: verificationCode,
                    expiresAt: expiresAt,
                }},
            { upsert: true }
        );
        res.status(200).json('Utente salvato momentaneamente. Controlla la tua email per il codice di verifica.');

    } catch (error) {return res.status(500).json('Errore del server.');}
}

exports.registrationVerify = async (req, res) => {
    try{
        const { email, verificationCode } = req.body;

        const pendingUser = await PendingUser.findOne({ email });
        if(!pendingUser) return res.status(400).json('Utente non trovato.');

        if (pendingUser.expiresAt < new Date()) {
            await PendingUser.deleteOne({ email });
            return res.status(400).json('Codice scaduto.');
        }

        if (pendingUser.verificationCode !== verificationCode) return res.status(400).json('Codice di verifica errato.');

        await User.create({
            username: pendingUser.username,
            email: pendingUser.email,
            password: pendingUser.hashedPassword
        });

        await PendingUser.deleteOne({ email });

        res.status(200).json("Codice di verifica corretto. Ora sarai reindirizzato alla pagina di login.")
        }
    catch(error) { return res.status(500).json('Errore del server.'); }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json('Credenziali non valide.')

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json('Credenziali non valide.')

        const payload = {
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "15m"});
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"});

        await User.findOneAndUpdate({email: email}, {refreshToken: refreshToken });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni in ms
            path: '/api/auth/refresh'
        })

        //uso http o https in base al contesto. Nel contesto di sviluppo (locale), NODE_ENV = "development" quindi secure:false (HTTP), mentre
        //nel contesto di produzione (online), NODE_ENV = "production" quindi secure:true (HTTPS)

        res.status(200).json({
                id: user._id,
                username: user.username,
                email: user.email,
                accessToken: accessToken
        });
    } catch (error) { res.status(500).json('Errore del server.'); }
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
        await PendingUser.findOneAndUpdate(
            { email },
            { $set: { verificationCode: code, expiresAt: expiresAt  } },
            { upsert: true }
        );
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
        if (newPassword !== confirmNewPassword) return res.status(400).json( 'Le password non corrispondono.');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await User.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });

        res.status(200).json('Password aggiornata con successo.');

    }catch(error){ res.status(500).json('Errore del server.'); }
}

exports.refresh = async (req, res) => {
    try{
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
        res.json(newAccessToken);
    }catch (error) { res.status(500).json('Errore del server.'); }
}

exports.logout = async (req, res) => {
    try {
        const userID = req.user.id;

        await User.findByIdAndUpdate(userID,{ $set: { refreshToken: " " } });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 giorni in ms
            path: '/api/auth/refresh'
        });

        res.status(200).json('Logout effettuato con successo.');
        }catch (error) { res.status(500).json('Errore del server.'); }
}

