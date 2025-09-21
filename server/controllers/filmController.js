require('dotenv').config();
const User = require('../models/User');

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


//le richieste sono paginate (prendo solo la prima pagina massimo 20 film da mostrare nel carosello).


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
    const { filmTitle } = req.body;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY_TMDB}&query=${filmTitle}`);
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