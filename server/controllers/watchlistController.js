require('dotenv').config();
const Film = require('../models/Film');
const User = require('../models/User');


exports.addToWatchlist = async (req, res) => {
    try{
        const userID = req.user.id;
        let { film } = req.body;

        //il server verifica se il film esiste già nella collezione films verificando l'id, se non esiste lo crea.
        // questo garantisce di avere sempre una sola copia dei dati di ogni film.
        //findOneandUpdate(filter, update, options)
        await Film.findOneAndUpdate(
            { _id: film.id }, // Condizione di ricerca
            //se non esiste crea un nuovo oggetto film nella collezione films:
            { $set: {
                    title: film.title,
                    release_year: film.release_year,
                    director: film.director,
                    poster_path: film.poster_path,
                }},
            {
                upsert: true // Se il documento non esiste sulla base del filtro, ne crea uno nuovo sulla base di update
            }
        );

        //per aggiungere l'id del film all'array watchlist dell'utente, uso $addToSet che
        // aggiunge un elemento a un array SOLO SE non è già presente (evitare duplicati)
        await User.findByIdAndUpdate(
            userID,
            { $addToSet: { watchlist: film.id }
            }) //con embedding avremmo fatto watchlist: film, aggiungendo l'intero oggetto film

        res.status(200).json(`"${film.title}" aggiunto alla watchlist!`);
    }catch(error){
        res.status(500).json("Errore interno del server." );
    }
}

exports.removeFromWatchlist = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);

        const user = await User.findById(userID);
        user.watchlist = user.watchlist.filter(id => id !== filmID);

        await user.save();

    }catch(error){
        res.status(500).json("Errore interno del server." );
    }
    res.status(200).json("Film eliminato dalla watchlist");
}

exports.getWatchlist = async (req, res) => {
    try{
        const userID = req.user.id; //prendo l'id dell'utente da req.user fornito dal middleware verifyjwt
        let user = await User.findById(userID).populate('watchlist').populate('reviews'); //trova l'utente con quell'id e popola l'array watchlist con i dati
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }

        //N.B. le proprietà dei film da mostrare nella pagina watchlist si trovano nella proprietà _doc dell'oggetto film
        let watchlist = user.watchlist.map( (film) => {
            return {...film._doc, rating: null, date: null};
        })

        // 4. Invia al frontend l'array 'watchlist' che ora contiene gli oggetti film completi, non più solo gli ID
        res.status(200).json(watchlist);

    }catch(error){
        res.status(500).json("Errore interno del server.")
    }
}