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

            }
        };
        // Creo i due token
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "15m"}) // verrà salvato nella memoria locale del browser
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "7d"}) // verrà salvato nel DB

        //salvo il refreshtoken nel DB nella proprietà refreshToken dell'utente
        user.refreshToken = refreshToken;
        await user.save();


        //inserisco il refreshtoken nel cookie per inviarlo al browser
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,// 7 giorni in ms
            path: '/api/auth/refresh' //il refreshtoken viene inviato in un percorso sicuro
        })

        //uso http o https in base al contesto. Nel contesto di sviluppo (locale), NODE_ENV = "development" quindi secure:false (HTTP), mentre
        //nel contesto di produzione (online), NODE_ENV = "production" quindi secure:true (HTTPS)

        // Invia come riposta i dati dell'utente + accessToken
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
    if (!refreshToken) return res.status(401).json('Refresh token non esistente. L utente deve loggarsi di nuovo.');


    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json("Il refresh token non corrisponde a nessun utente")


    let payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    if (payload.user.id !== user._id.toString()) return res.status(403).json("Errore nella verifica del refreshtoken")
    payload = {user: payload.user}; //elimino i campi iat ed exp generati automaticamente da jwt dopo la verifica


    const newAccessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
    res.json(newAccessToken); //token aggiornato

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

exports.logout = async (req, res) => {
    //devo invalidare il refreshToken eliminandolo dal DB e l'access Token inviando al client un cookie già scaduto, così
    // verrà automaticamente scartato.
    try {
        let refreshToken = req.cookies.refreshToken;

        const user = await User.findOne({ refreshToken: refreshToken });
        if (user) {
            //Rimuovo il refresh token dal documento dell'utente nel DB
            user.refreshToken = '';
            await user.save();
        }

        res.cookie('accessToken', '', {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json('Logout effettuato con successo.');
    }
    catch (error) {
        res.status(500).json('Errore del server.');
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

exports.getProfileData = async (req, res) => {
    try{
        const userID = req.user.id;
        const user = await User.findById(userID);
        let profileData = {
            username: user.username ? user.username : "",
            email: user.email ? user.email : "",
            name: user.name ? user.name : "",
            surname: user.surname ? user.surname : "",
            biography: user.biography ? user.biography : "",
            country: user.country ? user.country : "",
        }
        res.json(profileData);
    }catch(error){
        res.status(500).json('Errore del server.');
    }
}

exports.updateProfile = async (req, res) => {
    try{
        const userID = req.user.id;
        const profileData = req.body;

        await User.updateOne(
            { _id: userID },
            { $set: {
                    username: profileData.username,
                    email: profileData.email,
                    name: profileData.name,
                    surname: profileData.surname,
                    biography: profileData.biography,
                    country: profileData.country

            } },
            {
                runValidators: true //esegue le validazioni dello schema (es. unique)
            }
            )
        let user = {
            id: userID,
            username: profileData.username,
            email: profileData.email,
            name: profileData.name,
            surname: profileData.surname,
            biography: profileData.biography,
            country: profileData.country
        }
        res.status(200).json(user)
    }catch(error){
        res.status(500).json('Errore del server.');
    }


}