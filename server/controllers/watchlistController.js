const Film = require('../models/Film');
const User = require('../models/User');
const Activity = require("../models/Activity");


exports.addToWatchlist = async (req, res) => {
    try{
        const userID = req.user.id;
        let { film } = req.body;
        const user = await User.findById(userID);

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
                    popularity: film.popularity,
                    genres: film.genres
                }},
            {
                upsert: true // Se il documento non esiste sulla base del filtro, ne crea uno nuovo sulla base di update
            }
        );

        //aggiungo l'azione alle attività
        const newActivity = new Activity({
            user: userID,
            filmID: film.id,
            filmTitle: film.title,
            action: 'ADD_TO_WATCHLIST',
            date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
        })

        await newActivity.save();

        //per aggiungere l'id del film all'array watchlist dell'utente, uso $addToSet che
        // aggiunge un elemento a un array SOLO SE non è già presente (evitare duplicati)
        await User.findByIdAndUpdate(
            userID,
            { $addToSet: { watchlist: film.id, activity: newActivity._id }
            })

        //l'attività va aggiunta anche a tutti gli amici che seguo
        //aggiorno simultaneamente tutti gli utenti con _id contenuti nella lista user.following
        await User.updateMany(
            {_id: {$in: user.following}},
            {$addToSet: { activity: newActivity._id }}
        )

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
        res.status(200).json("Film eliminato dalla watchlist");

    }catch(error){
        res.status(500).json("Errore interno del server." );
    }

}

exports.getWatchlist = async (req, res) => {
    try{
        const username = req.params.username;
        const { genre, decade, minRating, sortByDate, sortByPopularity } = req.query;

        let user = await User.findOne({ username: username }).populate('watchlist');
        if (!user) {
            return res.status(404).json("Utente non trovato.");
        }

        let watchlist = user.watchlist.reverse();

        //Una volta che ottengo tutti i film visti, posso filtrare i risultati in base ai parametri
        if(genre){
            watchlist = watchlist.filter(film => film.genres.some(g => g.id === parseInt(genre)) )
        }

        if(decade){
            watchlist = watchlist.filter( film => film.release_year >= parseInt(decade) && film.release_year <= parseInt(decade) + 9 )
        }

        if(sortByDate){
            watchlist = sortByDate === "Dal meno recente" ? watchlist.reverse() : watchlist
        }

        if (sortByPopularity){
            watchlist = watchlist.sort((a,b) => b.popularity - a.popularity);
        }

        if(minRating){
            watchlist = watchlist.filter( film => film.rating >= parseInt(minRating))
        }
        res.status(200).json(watchlist);

    }catch(error){
        res.status(500).json("Errore interno del server.")
    }
}