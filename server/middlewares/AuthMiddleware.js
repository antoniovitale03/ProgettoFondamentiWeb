//alle richieste successive il client invia il token jwt e il server deve verificare dal token ricevuto se il client è autenticato,
// ma non può controllare dal DB perchè non l'ha salvato. Quindi il server usa un middleware verifyJWT per le richieste successive che verifica la firma
// usando il JWT_SECRET per garantire che il token non sia stato manomesso ed estrae dal token il payload, che contiene i dati dell'utente
//che verranno inviati al middleware successivo.

//il middleware successivo può usare i dati dell'utente per gestire varie operazioni logiche (es. visualizza tutti i post dell'utente,
// presumendo che l'utente è autenticato perchè è passato da verifyJWT.
//infatti verifyJWT Puoi metterlo davanti a POST /api/posts, PUT /api/settings, DELETE /api/comments, ecc.

const jwt = require('jsonwebtoken');

exports.verifyJWT = function(req, res, next) {
    // 1. Legge il token dal cookie ricevuto dal client.
    // 2. Grazie a 'cookie-parser', il server può accedere ai cookie della richiesta in req.cookies
    const token = req.cookies.token;
    //controlla se il cookie esiste
    if (!token) {
        return res.status(401).json({ message: 'Nessun token, autorizzazione negata.' });
    }
    try {
        // Decodifichiamo il token usando il tuo segreto ed estraiamo il payload
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Se il token è valido, il suo payload conterrà i dati che abbiamo inserito durante la firma (es. { user: { id: '...' } }).
        // Aggiungiamo queste informazioni all'oggetto 'req' per renderle disponibili ai middleware successivi
        req.user = payload.user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token non valido.' });
    }
};

