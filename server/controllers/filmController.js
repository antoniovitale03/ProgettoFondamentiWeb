require('dotenv').config();
const Film = require('../models/Film');
const User = require('../models/User');
const Review = require('../models/Review');

async function getFilmDirector(filmID) {
    // Chiamata usata per ottenere il cast (tutti gli attori) e la crew (regista, sceneggiatore, scrittore, ...), più
    //utile per ottenere solo
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
    const credits = await creditsResponse.json();

    // 3. Trova il regista nell'array 'crew'
    const directorObject = credits.crew.find( (member) => member.job === 'Director');

    // 4. Estrai il nome (gestendo il caso in cui non venga trovato)
    const director = directorObject ? {name: directorObject.name, id:directorObject.id} : null;
    return director;
}

//https://api.themoviedb.org/3/movie/550/recommendations?api_key=YOUR_API_KEY&language=it-IT&page=1
//https://api.themoviedb.org/3/movie/550/similar?api_key=YOUR_API_KEY&language=it-IT&page=1

//le richieste sono paginate (prendo solo la prima pagina massimo 20 film da mostrare nel carosello).
exports.getHomePageFilmsInfo = async (req, res) => {
    try{
        //trovo i film simili a quelli già visti
        const userID = req.user.id;
        //ottengo i film visti per poter prendere 4 film casuali visti e per ognuno raccomandare 5 film (questo vale solo per il carosello, che
        //ha un numero limitato di 20 film in modo che ad ogni caricamento mostro film raccomandati diversi)
        const user = await User.findById(userID).populate("watched")
        let randomFilms = [...user.watched].sort(() => 0.5 - Math.random()).slice(0, 4);
        let similarFilms = randomFilms.map( async (film) => {
                 const response = await fetch(`https://api.themoviedb.org/3/movie/${film.id}/similar?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=1`);
                 const data = await response.json();
                 data.results = data.results.map( film => {
                     return {
                         _id: film.id,
                         title: film.title,
                         release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
                         poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : null,
                     }
                 })
                 return data.results.slice(0,5);
             })
        similarFilms = await Promise.all(similarFilms);
        similarFilms = similarFilms.flat();


        const urls = [
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=1`,
            `https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.API_KEY_TMDB}&language=en-EN&region=IT&page=1`,
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=1`,
            `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY_TMDB}&language=en-EN&region=IT&page=1`,
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.API_KEY_TMDB}&language=en-EN`
        ];
        let responses = urls.map(url => fetch(url));
        responses = await Promise.all(responses);

        let data = responses.map(response => response.json());
        data = await Promise.all(data);
        data.forEach(film => {
            film.results = film.results.map( film => {
                return {
                    _id: film.id,
                    title: film.title,
                    release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
                    poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl,
                }
            })
            });

        //le informazioni mostrate nei caroselli fanno riferimento solo alla prima pagina
        const homePageFilms = {
            currentPopularFilms: data[0].results,
            upcomingFilms: data[1].results,
            topRatedFilms: data[2].results,
            nowPlayingFilms: data[3].results,
            trendingFilms: data[4].results,
            similarFilms: similarFilms,
        }
        res.status(200).json(homePageFilms);
    }catch(error){
        res.status(500).json("Errore interno del server");
    }
}

//funzioni utilizzate per mostrare i film più nel dettaglio nella singola componente, in base al numero di pagina
exports.getCurrentPopularFilms = async (req, res) => {
    const {pageNumber} = req.params;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${pageNumber}`);
        let data = await response.json();
        data.results = data.results.map(film => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
            }
        })
        res.status(200).json(data);
    }catch(error){
        res.status(500).json("Errore interno del server");
    }
}

exports.getUpcomingFilms = async (req, res) => {
    const {pageNumber} = req.params;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.API_KEY_TMDB}&language=en-EN&region=IT&page=${pageNumber}`);
        let data = await response.json();
        console.log(data.results);
        data.results = data.results.map(film => {
            return {
                _id: film.id,
                title: film.title,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
            }
        })
        res.status(200).json(data);
    }catch(error){
        res.status(500).json("Errore interno del server");
    }
}

exports.getTopRatedFilms = async (req, res) => {
    const {pageNumber} = req.params;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY_TMDB}&language=it-IT&page=${pageNumber}`);
        let data = await response.json();
        data.results = data.results.map(film => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
            }
        })
        res.status(200).json(data);
    }catch(error){
        res.status(500).json("Errore interno del server");
    }
}

exports.getNowPlayingFilms = async (req, res) => {
    const {pageNumber} = req.params;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY_TMDB}&language=en-EN&region=IT&page=${pageNumber}`);
        let data = await response.json();
        data.results = data.results.map(film => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
            }
        })
        res.status(200).json(data);
    }catch(error){
        res.status(500).json("Errore interno del server");
    }

}

exports.getTrendingFilms = async (req, res) => {
    const {pageNumber} = req.params;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${pageNumber}`);
        let data = await response.json();
        data.results = data.results.map(film => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
            }
        })
        res.status(200).json(data);
    }catch(error){
        res.status(500).json("Errore interno del server");
    }
}

//ottieni i film simili ad uno specifico film (con un certo ID)
exports.getSimilarFilms = async (req, res) => {
    const {filmID, pageNumber} = req.params;
    const response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/similar?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${pageNumber}`);
    const data = await response.json();
    data.results = data.results.map( film => {
        return {
            _id: film.id,
            title: film.title,
            release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
            poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
        }
    })
    res.status(200).json(data);
}

exports.getAllGenres = async (req, res) => {
    try{
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY_TMDB}&language=en-EN`);
        const data = await response.json();
        res.status(200).json(data.genres);
    }catch(error){
        res.status(500).json("Errore interno del server");
    }
}
//ottieni i risultati di ricerca di un film (array di oggetti film)
//N.B per ogni film mostro solo locandina, titolo, data di uscita e regista

exports.getFilmsFromSearch = async (req, res) => {
    const { title } = req.body;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY_TMDB}&query=${title}`);
    const data = await response.json();
    let films = data.results; //ottengo la lista di tutti i film che corrispondono alla ricerca
    //aggiungo ad ogni film la proprietà che riguarda il regista, completo l'url per locandina e sfondo (se esistono) e
    //converto release_date indicando solo l'anno di uscita senza mese e giorno
    films = films.map(async (film) => {  //array di Promise
        const director = await getFilmDirector(film.id);
        const year = film.release_date ? new Date(film.release_date).getFullYear() : "N/A";
        return {
            title: film.title,
            _id: film.id,
            director: director,
            poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl,
            release_year: year,
        };
    });

    films = await Promise.all(films);
    res.status(200).json(films);
}

exports.getArchiveFilms = async (req, res) => {
    try{
        const { params } = req.body;
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${params.page}`;
        if (params.sortBy){
            url += `&sortBy=${params.sortBy}`;
        }
        if (params.genre){
            url += `&with_genres=${params.genre}`;
        }

        // La decade deve essere tradotta in un intervallo di date
        if(params.decade){
            //calcolo il primo e ultimo anno della decade (es. 1980s va da 1980 a 1989).
            let firstYear = parseInt(params.decade);
            let lastYear = firstYear + 9;
            url += `&primary_release_date.gte=${firstYear}-01-01`;
            url += `&primary_release_date.lte=${lastYear}-12-31`;
        }


        if(params.minRating !== 0){
            url += `&vote_average.gte=${params.minRating}`;
        }

        const response = await fetch(url);
        let data = await response.json();

        const films = data.results.map(film => {
            return {
                _id: film.id, title: film.title,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : 'N/A'
            }
        })

        res.status(200).json({
            films: films,
            totalPages: data.total_pages
        });
    }catch(error){
        res.status(500).json("Errore interno del server");
    }
}

exports.getFilmsByYear = async (req, res) => {
    try{
        const { year, page } = req.params;
        //usando questa API posso ottenere 20 film per pagina
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY_TMDB}&primary_release_year=${year}&page=${page}&language=en-EN&sort_by=popularity.desc`);
        let data = await response.json();
        data.results = data.results.map( film => {
            return {
                _id: film.id,
                title: film.title,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
            }}
        )
        data = {films: data.results, totalPages: data.total_pages}
        res.status(200).json(data); //invio l'array dei film e il numero totali di pagine
    }catch(error){
        console.log(error);
        res.status(200).json("Errore nel caricamento dei film")
    }

}
//questa funzione serve per trovare un film conoscendo il suo ID di tmdb e il suo titolo, restituendo tutte le informazioni che
//dovranno essere mostrate nella filmPage
exports.getFilm = async (req, res) => {
    const filmTitle = req.params.filmTitle;
    const filmID = parseInt(req.params.filmID);
    const userID = req.user.id;

    let response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}?api_key=${process.env.API_KEY_TMDB}&query=${filmTitle}`);
    let film = await response.json();
    //trovo il regista e modifico la data d'uscita
    const director = await getFilmDirector(filmID); //oppure film.id
    const year = film.release_date ? new Date(film.release_date).getFullYear() : "N/A";
    //trovo il cast e la crew
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
    const credits = await creditsResponse.json();

    //aggiusto l'url per la locandina degli attori e di tutti i membri della crew
    let cast = credits.cast.map( (actor) => {
        const actor_image = actor.profile_path ? process.env.posterBaseUrl + actor.profile_path : process.env.greyPosterUrl
        return {...actor, profile_path: actor_image}
    })

    let crew = credits.crew.map( (crewMember) => {
        const member_image = crewMember.profile_path ? process.env.posterBaseUrl + crewMember.profile_path : process.env.greyPosterUrl
        return {...crewMember, profile_path: member_image}
    })

    //calcolo il rating medio del film
    let avgRating = (film.vote_average)/2; //rating in quinti
    avgRating = avgRating !== 0 ? Number(avgRating.toFixed(1)) : null;  //lo blocco ad una cifra decimale (se è 0 lo setto a null)

    //calcolo il rating inserito dall'utente
    let user = await User.findById(userID).populate('reviews');
    let review = user.reviews.find( (review) => review._id === filmID)
    let userRating = review !== undefined ? review.rating : null;

    //trovo il link Youtube del trailer
    response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/videos?api_key=${process.env.API_KEY_TMDB}&language=en-EN`);
    let data = await response.json();
    let youtubeTrailerObj = data.results.find( video => video.site === 'YouTube' && video.type === 'Trailer');
    if (youtubeTrailerObj) {
        let key = youtubeTrailerObj.key;
        var youtubeTrailerLink = `https://www.youtube.com/watch?v=${key}`;
    }

    //controllo se il film è in watchlist, nei film piaciuti, se è stato recensito, aggiutno tra i preferiti o tra i film visti
    let isInWatchlist = user.watchlist.find( (id) => id === filmID )
    isInWatchlist = isInWatchlist === undefined ? false : true;

    let isLiked = user.liked.find( (id) => id === filmID )
    isLiked = isLiked === undefined ? false : true;

    let isReviewed = user.reviews.find( (review) => review._id === filmID )
    isReviewed = isReviewed  === undefined ? false : true;

    let isFavorite = user.favorites.find( (id) => id === filmID )
    isFavorite = isFavorite === undefined ? false : true;

    let isWatched = user.watched.find( (id) => id === filmID )
    isWatched = isWatched === undefined ? false : true;

    const filmInfo = [isInWatchlist, isLiked, isReviewed, isFavorite, isWatched];

    //ottengo i dettagli del film
    let filmDetails = {
        production_companies: film.production_companies.map( e => {return {name: e.name, country: e.origin_country}}),
        origin_country: film.origin_country,
        original_language: film.original_language,
        spoken_languages: film.spoken_languages.map(e => e.english_name),
        budget: film.budget,
        revenue: film.revenue,
    }

    film = {...film,
        _id: film.id,
        director: director,
        release_year: year,
        poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl,
        backdrop_path: film.backdrop_path ? process.env.bannerBaseUrl + film.backdrop_path : process.env.greyPosterUrl,
        cast: cast,
        crew: crew,
        trailerLink: youtubeTrailerLink ? youtubeTrailerLink : null,
        avgRating: avgRating,
        userRating: userRating,
        genres: film.genres,
        filmInfo: filmInfo,
        details: filmDetails
    }
    res.status(200).json(film);
}



//il server verifica se il film esiste già nella collezione films e se non esiste lo crea.
// Questo garantisce di avere sempre una sola copia dei dati di ogni film.
// Dopodichè aggiunge l'ID di quel film all'array watchlist dell'utente, ma solo se non è già presente per evitare duplicati. (associazione tramite riferimento)
// N.B. usato id nell'api tmdb e _id in mongodb, in modo da poter effettuare populate()
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

exports.addToFavorites = async (req, res) => {
    try{
        const userID = req.user.id;
        let {film} = req.body;

        //controllo che venga rispettato il limite di 10 film preferiti
        const user = await User.findById(userID)
        if (user.favorites.length >= 10){
            return res.status(500).json("Impossibile aggiungere il film. Hai superato il limite di 10 film nei preferiti");
        }

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                _id: film.id,
                title: film.title,
                release_year: film.release_year,
                director: film.director,
                poster_path: film.poster_path,
            },
            {
                upsert: true
            });
        await User.findByIdAndUpdate(
            userID,
            { $addToSet: { favorites: film.id } }
        )
        res.status(200).json(`"${film.title}" aggiunto alla lista dei favoriti!`);

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

exports.removeFromFavorites = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);

        const user = await User.findById(userID);
        user.favorites = user.favorites.filter(id => id !== filmID);

        await user.save();

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
    res.status(200).json("Film rimosso dai preferiti")
}

exports.getFavorites = async (req, res) => {
    try{
        const userID = req.user.id;
        const user = await User.findById(userID).populate('favorites');
        if(!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }
        let favorites = user.favorites.map( async (film) => {
            return {...film._doc, director: await getFilmDirector(film._id), rating: null, date: null}
        })
        favorites = await Promise.all(favorites);
        res.status(200).json(favorites);

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

exports.saveReview = async (req, res) => {
    try{
        const {title, releaseYear, review, rating} = req.body;
        const userID = req.user.id;
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY_TMDB}&query=${title}`);
        const data = await response.json();
        let films = data.results;
        if (!films) {
            return res.status(400).json("Nessun film trovato." );
        }
        //trovo il film che corrisponde alla data di uscita che ho inserito, sempre se è corretta
        let film = films.find((film) => new Date(film.release_date).getFullYear() === releaseYear);
        if (!film) {
            return res.status(400).json("Nessun film trovato.");
        }

        //il film è stato trovato, quindi modifico l'url per mostrare la locandina

        await Review.findOneAndUpdate(
            { _id: film.id }, // Condizione di ricerca
            //se non esiste crea un nuovo oggetto film nella collezione films:
            {
                _id: film.id,
                title: film.title,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl,
                release_year: releaseYear,
                review: review,
                rating: rating,
                review_date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
            },
            {
                upsert: true // Se il documento non esiste sulla base del filtro, ne crea uno nuovo sulla base di update
            }
        );
        //siccome un film recensito corrisponde ad un film già visto dall'utente, lo inserisco anche nella lista dei film visti
        await User.findByIdAndUpdate(userID, {
            $addToSet: {
                reviews: film.id,
                watched: film.id
            }
        });
        //e aggiungo il rating (dovengo aggiungere un'oggetto film devo calcolare il regista)
        const director = await getFilmDirector(film.id); //oppure film.id

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                _id: film.id,
                title: film.title,
                release_date: releaseYear,
                director: director,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl,
            },
            {
                upsert: true
            }
        )

        res.status(200).json(`Recensione di "${film.title}" salvata correttamente!`);
    }catch(error){
        console.log(error)
        res.status(500).json("Errore interno del server.");
    }


}

exports.deleteReview = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);
        const user = await User.findById(userID)

        user.reviews = user.reviews.filter(id => id !== filmID);
        await user.save();

        await Review.findOneAndDelete( {_id: filmID} );

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
    res.status(200).json("Recensione rimossa")
}

exports.getReviews = async (req, res) => {
    try{
        const userID = req.user.id;
        let user = await User.findById(userID).populate('reviews');
        if (!user) {
            return res.status(404).json({ message: "Utente non trovato." });
        }

        let reviews = user.reviews.map( review => {
            return {...review._doc}
        })

        res.status(200).json(reviews);

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

exports.addToLiked = async (req, res) => {
    try{
        const userID = req.user.id;
        let { film } = req.body;

        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                _id: film.id,
                title: film.title,
                release_year: film.release_year,
                director: film.director,
                poster_path: film.poster_path
            },
            {
                upsert: true
            });

        await User.findByIdAndUpdate(userID, {
            $addToSet: { liked: film.id }
        })

        res.status(200).json({ message: `"${film.title}" aggiunto alla lista dei film piaciuti!`  });
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

exports.removeFromLiked = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);

        const user = await User.findById(userID);
        user.liked = user.liked.find(id => id !== filmID);
        await user.save()
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
    res.status(200).json("Film rimosso dai piaciuti")
}

exports.addToWatched = async (req, res) => {
    try{
        const userID = req.user.id;
        const { film } = req.body;
        await Film.findOneAndUpdate(
            { _id: film.id },
            {
                _id: film.id,
                title: film.title,
                release_year: film.release_year,
                director: film.director,
                poster_path: film.poster_path,
                date: new Date().toLocaleDateString("it-IT", {year: 'numeric', month: 'long', day: 'numeric'})
            },
            {
                upsert: true
            }
        )
        //se ho visto un film eventualmente va rimosso dalla watchlist
        await User.findByIdAndUpdate(userID, {
            $addToSet: { watched: film.id },
            $pull: {watchlist: film.id}
        })

        res.status(200).json({ message: `"${film.title}" aggiunto alla lista dei film visti!`  });
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}

exports.removeFromWatched = async (req, res) => {
    try{
        const userID = req.user.id;
        const filmID = parseInt(req.params.filmID);

        const user = await User.findById(userID);
        user.watched = user.watched.find(id => id !== filmID);
        await user.save()
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
    res.status(200).json("Film rimosso da quelli visti")
}

exports.getWatched = async (req, res) => {
    const userID = req.user.id;
    const user = await User.findById(userID).populate('watched').populate('reviews');
    //per ogni film visto controllo se è stato anche piaciuto e il suo rating
    let watchedFilms = user.watched.map( (watchedFilm) => {
        let isLiked = user.liked.find( (likedFilm) => likedFilm === watchedFilm._id)//controllo se il film è anche piaciuto
        isLiked = isLiked === undefined ? false : true;
        let review = user.reviews.find( (review) => review._id === watchedFilm._id) // trovo la recensione (se esiste)
        let rating = review !== undefined ? review.rating : null;
        return {...watchedFilm._doc,
            director: null, //nella pagina dei film visti non mostro il regista di ogni film
            isLiked: isLiked,
            rating: rating,
        }
    })
    res.status(200).json(watchedFilms);
}

exports.getActorInfo = async (req, res) => {
    try{
        const actorID = req.params.actorID;
        const response = await fetch(`https://api.themoviedb.org/3/person/${actorID}?api_key=${process.env.API_KEY_TMDB}&language=en-EN&append_to_response=movie_credits`);
        let data = await response.json();
        let actorPersonalInfo = {
            _id: data.id,
            name: data.name,
            biography: data.biography,
            birthday: data.birthday,
            profile_image: data.profile_path ? process.env.posterBaseUrl + data.profile_path : process.env.greyPosterUrl
        }
        //film in cui ha partecipato come attore
        let actorCast = data.movie_credits.cast.map( (film) => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : "N/A",
                character: film.character,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
            }
        })

        //lo ordino per anno di uscita
        actorCast = [...actorCast].sort((a, b) => {
            // Se b ha un anno e a no, b viene prima
            if (b.release_year === "N/A") return -1;
            if (a.release_year === "N/A") return 1;

            // Ordina numericamente in modo decrescente
            return b.release_year - a.release_year; //se è positivo, mette a prima di b; altrimento mette b prima di a
        });


        //film in cui ha partecipato con un ruolo tecnico (sceneggiatore, scrittore, ecc...)
        let actorCrew = data.movie_credits.crew.map( (film) => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : "N/A",
                job: film.job,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
            }
        })

        actorCrew = [...actorCrew].sort((a, b) => {
            if (b.release_year === "N/A") return -1;
            if (a.release_year === "N/A") return 1;

            return b.release_year - a.release_year;
        })



        const actorInfo = {
            personalInfo: actorPersonalInfo,
            cast: actorCast, //film in cui la persona ha svolto un ruolo di attore
            crew: actorCrew //film in cui la persona ha svotlo un ruolo più tecnico (sceneggiatore, scrittore, ecc...)
        }

        res.status(200).json(actorInfo);
    }catch(error){
        res.status(500).json("Errore interno del server.");
    }

}

exports.getDirectorInfo = async (req, res) => {
    try{
        const directorID = parseInt(req.params.directorID);
        const response = await fetch(`https://api.themoviedb.org/3/person/${directorID}?api_key=${process.env.API_KEY_TMDB}&language=en-EN&append_to_response=movie_credits`)
        let data = await response.json();
        let directorPersonalInfo = {
            _id: data.id,
            name: data.name,
            birthday: data.birthday,
            biography: data.biography,
            place_of_birth: data.place_of_birth,
            profile_image: data.profile_path ? process.env.posterBaseUrl + data.profile_path : process.env.greyPosterUrl,
        }


        let directorCast = data.movie_credits.cast.map( (film) => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : "N/A",
                character: film.character,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
            }
        })

        let directorCrew = data.movie_credits.crew.map( (film) => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : "N/A",
                job: film.job,
                poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
            }
        })
        const actorInfo = {
            personalInfo: directorPersonalInfo,
            cast: directorCast, //film in cui la persona ha svolto un ruolo di attore
            crew: directorCrew //film in cui la persona ha svotlo un ruolo più tecnico (sceneggiatore, scrittore, ecc...)
        }
        res.status(200).json(actorInfo);

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}