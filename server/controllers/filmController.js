require('dotenv').config();
const Film = require('../models/Film');
const User = require('../models/User');

async function getFilmDirector(filmID) {
    // 2. Chiamata per il cast (tutti gli attori) e la crew (regista, sceneggiatore, scrittore, ...)
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
    const credits = await creditsResponse.json();

    // 3. Trova il regista nell'array 'crew'
    const directorObject = credits.crew.find( (member) => member.job === 'Director');

    // 4. Estrai il nome (gestendo il caso in cui non venga trovato)
    const director = directorObject ? directorObject.name : null;
    return director;
}

//ottieni i risultati di ricerca di un film (array di oggetti film)
//N.B per ogni film mostro solo locandina, titolo, data di uscita e regista
exports.getFilmsFromSearch = async (req, res) => {
    const { film } = req.body;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY_TMDB}&query=${film}`);
    const data = await response.json();
    let films = data.results; //ottengo la lista di tutti i film che corrispondono alla ricerca
    //aggiungo ad ogni film la proprietà che riguarda il regista, completo l'url per locandina e sfondo (se esistono) e
    //converto release_date indicando solo l'anno di uscita senza mese e giorno
    films = films.map(async (film) => {  //array di Promise
        const title = film.title;
        const id = film.id;
        const director = await getFilmDirector(film.id);
        const poster_image_url = film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
        const year = film.release_date ? new Date(film.release_date).getFullYear() : "N/A";
        return{
            title: title,
            id: id,
            director: director,
            poster_path: poster_image_url,
            release_date: year,
        };
    });

    films = await Promise.all(films);
    res.status(200).json(films);
}

exports.findFilm = async (req, res) => {
    const { filmTitle, filmID } = req.body;
    const response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}?api_key=${process.env.API_KEY_TMDB}&query=${filmTitle}`);
    let film = await response.json();
    const director = await getFilmDirector(filmID); //oppure film.id
    const year = film.release_date ? new Date(film.release_date).getFullYear() : "N/A";
    film = {...film,
        director: director,
        release_date: year,
        poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl,
        backdrop_path: film.backdrop_path ? process.env.bannerBaseUrl + film.backdrop_path : process.env.greyPosterUrl
    }
    res.status(200).json(film);
}

//il server verifica se il film esiste già nella collezione films e se non esiste lo crea.
// Questo garantisce di avere sempre una sola copia dei dati di ogni film.
// Dopodichè aggiunge l'ID di quel film all'array watchlist dell'utente, ma solo se non è già presente per evitare duplicati. (associazione tramite riferimento)
// N.B. usato id nell'api tmdb e _id in mongodb, in modo da effettuare populate()
exports.addToWatchlist = async (req, res) => {
    try{
        const userID = req.user.id;
        let { film } = req.body;

        //il server verifica se il film esiste già nella collezione films verificando l'id, se non esiste lo crea.
        // questo garantisce di avere sempre una sola copia dei dati di ogni film.

        film = await Film.findOneAndUpdate(
            { _id: film.id }, // Condizione di ricerca
            //se non esiste crea un nuovo oggetto film nella collezione films:
            {
                _id: film.id,
                title: film.title,
                poster_path: film.poster_path,
                release_date: film.release_date
            },
            {
                upsert: true, // Crea il documento se non esiste
                new: true     // Restituisci il documento nuovo/aggiornato (oppure returnDocument: "after")
            }
        );

        //per aggiungere l'id del film all'array watchlist dell'utente, uso $addToSet che
        // aggiunge un elemento a un array SOLO SE non è già presente (evitare duplicati)
        await User.findByIdAndUpdate(
            userID,
            { $addToSet: { watchlist: film._id } }, //con embedding avremmo fatto watchlist: film, aggiungendo l'intero oggetto film
            { new: true } // Restituisci l'utente aggiornato
        )

        res.status(200).json({ message: `"${film.title}" aggiunto alla watchlist con successo!`  });
    }catch(error){
        res.status(500).json({ message: "Errore interno del server." });
    }
}

exports.getWatchlist = async (req, res) => {
    try{
        const userID = req.user.id; //prendo l'id dell'utente da req.user fornito dal middleware verifyjwt
        let user = await User.findById(userID).populate('watchlist'); //trova l'utente con quell'id e popola l'array watchlist con i dati
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }

        let watchlist = user.watchlist.map( async (film) => {
                return {...film._doc, director: await getFilmDirector(film._id)}}
            )

        watchlist = await Promise.all(watchlist);
        console.log(watchlist);
        // 4. Invia al frontend l'array 'watchlist' che ora contiene gli oggetti film completi, non più solo gli ID
        res.status(200).json(watchlist);

    }catch(error){
        res.status(500).json({ message: "Errore interno del server." })
    }

}