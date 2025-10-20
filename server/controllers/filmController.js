
const User = require('../models/User');
const {getReviews} = require("./reviewsController");

//funzione che calcola l'url delle immagini
function getImageUrl(baseUrl, size, imagePath){
    if(imagePath){
        return `${baseUrl}/${size}${imagePath}`;
    }else{
        const width = parseInt(size.slice(1)); //w500 -> 500
        const height = Math.round(width * 1.5);
        return `https://placehold.co/${width}x${height}/EFEFEF/EFEFEF`; //locandina grigia
    }
}

async function getFilmDirector(filmID) {
    // Chiamata usata per ottenere il cast (tutti gli attori) e la crew (regista, sceneggiatore, scrittore, ...),
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
    const credits = await creditsResponse.json();

    // 3. Trova il regista nell'array 'crew'
    const directorObject = credits.crew.find( (member) => member.job === 'Director');

    // 4. Estrai il nome (gestendo il caso in cui non venga trovato)
    return directorObject ? {name: directorObject.name, id: directorObject.id} : null;
}

//vede se il film si trova in watchlist, nei film piaciuti, se è stato recensito, aggiutno tra i preferiti o tra i film visti
function getFilmStatus(user, filmID){
    return {
        isInWatchlist: user.watchlist.includes(filmID) === true ? 1 : 0,
        isLiked: user.liked.includes(filmID) === true ? 1 : 0,
        isReviewed: user.reviews.some( review => review.film === filmID ) === true ? 1 : 0,
        isFavorite: user.favorites.includes(filmID) === true ? 1 : 0,
        isWatched: user.watched.includes(filmID) === true ? 1 : 0,
        lists: user.lists.map( list => {
        return { name: list.name, isInList: list.films.includes(filmID) }}
        )
    }
}

//trova il trailer YT del film
async function getFilmTrailer(filmID) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/videos?api_key=${process.env.API_KEY_TMDB}&language=en-EN`);
    let data = await response.json();
    let youtubeTrailerObj = data.results.find( video => video.site === 'YouTube' && video.type === 'Trailer');
    if (youtubeTrailerObj) {
        let key = youtubeTrailerObj.key;
        return `https://www.youtube.com/watch?v=${key}`;
    }else{ return null }
}

//calcola il rating medio dle film e quello inserito dlal'utente durante la recensione
function getRating(user, film, filmID){
    let avgRating = (film.vote_average)/2; //rating in quinti
    avgRating = avgRating !== 0 ? Number(avgRating.toFixed(1)) : null;  //lo blocco ad una cifra decimale (se è 0 lo setto a null)

    //calcolo il rating inserito dall'utente
    let review = user.reviews.find( (review) => review.film === filmID);
    let userRating = review !== undefined ? review.rating : null;
    return {avgRating, userRating};
}

async function getCollectionFilms(film){
    if (film.belongs_to_collection){
        let collectionID = film.belongs_to_collection.id;
        let response = await fetch(`https://api.themoviedb.org/3/collection/${collectionID}?api_key=${process.env.API_KEY_TMDB}&language=en-EN`);
        let data = await response.json();
        return data.parts.map( film => {
            return {
                _id: film.id,
                title: film.title,
                poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
                rating: null
            }
        })
    }else{ return null }
}

async function getCastCrewPreview(filmID){
    let cast = [];
    let crew = [];
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
    const credits = await creditsResponse.json();
    if (credits.cast.length <= 6){
        cast = credits.cast.map( actor => {
            return {...actor, profile_path: getImageUrl(process.env.baseUrl, "w154", actor.profile_path) }})
    }else{
        cast = credits.cast.slice(0, 6).map( actor => {
            return {...actor, profile_path: getImageUrl(process.env.baseUrl, "w154", actor.profile_path) }})
    }

    if (credits.crew.length <= 6){
        crew = credits.crew.map( crewMember => {
            return {...crewMember, profile_path: getImageUrl(process.env.baseUrl, "w154", crewMember.profile_path) }
        })
    }else{
        crew = credits.crew.slice(0, 6).map( crewMember => {
            return {...crewMember, profile_path: getImageUrl(process.env.baseUrl, "w154", crewMember.profile_path) }
        })
    }
    return {cast: cast, crew: crew}
}

async function getUserReviews(filmID){
    const response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/reviews?api_key=${process.env.API_KEY_TMDB}&language=en-EN`);
    const reviews = await response.json();
    return reviews;
}
//le richieste sono paginate (prendo solo la prima pagina massimo 20 film da mostrare nel carosello).


//ottieni i film simili ad uno specifico film (con un certo ID)
exports.getSimilarFilms = async (req, res) => {
    const {filmID} = req.params;
    const {page, genre, decade, minRating, sortByDate, sortByPopularity} = req.query;
    const response = await  fetch(`https://api.themoviedb.org/3/movie/${filmID}/similar?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${page}`);
    let data = await response.json();
    let films = data.results;

    films = films.map( film => {
        return {...film,
            _id: film.id,
            release_year: new Date(film.release_date).getFullYear(),
            poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
    }})

    if (genre){
        films = films.filter( film => film.genre_ids.some(g => g === parseInt(genre) ));
    }
    if(decade){
        films = films.filter( film => film.release_year >= parseInt(decade) && film.release_year <= parseInt(decade) + 9 );
    }
    if(minRating){
        films = films.filter( film => (film.vote_average)/2 >= parseInt(minRating)); // il rating di default nell'api è in decimi
    }
    if(sortByPopularity){
        if(sortByPopularity === "Dal più popolare"){
            films = films.sort((a,b) => b.popularity - a.popularity); //descrescente
        }else{
            films = films.sort((a,b) => a.popularity - b.popularity);
        }
    }
    if(sortByDate){
        if(sortByDate === "Dal più recente"){
            films = films.sort((a,b) => b.release_year - a.release_year);
        }else{// dal meno recente
            films = films.sort((a,b) => a.release_year - b.release_year);
        }
    }
    res.status(200).json({films: films, totalPages: data.total_pages});
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
    const filmTitle = req.params.filmTitle;
    const {genre, decade, minRating, sortByDate, sortByPopularity} = req.query;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY_TMDB}&query=${filmTitle}`);
    const data = await response.json();
    let films = data.results; //ottengo la lista dei risultati (film, serie tv e persone)
    films = films.map(async (film) => {  //array di Promise
        const release_year = film.release_date ? new Date(film.release_date).getFullYear() : null;
        let director = await getFilmDirector(film.id);
        delete film.release_date;
        return {
            ...film,
            _id: film.id,
            director: director,
            poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
            release_year: release_year,
            };
         });
    films = await Promise.all(films);

    if(genre){
        films = films.filter( film => film.genre_ids.includes(parseInt(genre) ));
    }

    if(decade){
        films = films.filter( film => film.release_year >= parseInt(decade) && film.release_year <= parseInt(decade) + 9 );
    }

    if(minRating){
        films = films.filter( film => (film.vote_average)/2 >= parseInt(minRating));
    }

    if(sortByDate){
        if(sortByDate === "Dal più recente"){
            films = films.sort((a,b) => b.release_year - a.release_year);
        }else{
            films = films.sort((a,b) => a.release_year - b.release_year);
        }
    }

    if(sortByPopularity){
        if(sortByPopularity === "Dal più popolare"){
            films = films.sort((a,b) => b.popularity - a.popularity);
        }else{
            films = films.sort((a,b) => a.popularity - b.popularity);
        }
    }
    res.status(200).json(films);
}

exports.getArchiveFilms = async (req, res) => {
    try{
        const {page, genre, decade, minRating, sortByPopularity, sortByDate} = req.query;
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${page}`;

        if (genre){
            url += `&with_genres=${genre}`;
        }

        // La decade deve essere tradotta in un intervallo di date
        if(decade){
            //calcolo il primo e ultimo anno della decade (es. 1980s va da 1980 a 1989).
            let firstYear = parseInt(decade);
            let lastYear = firstYear + 9;
            url += `&primary_release_date.gte=${firstYear}-01-01`;
            url += `&primary_release_date.lte=${lastYear}-12-31`;
        }

        if(minRating){
            url += `&vote_average.gte=${minRating}`;
        }

        if (sortByPopularity){
            if(sortByPopularity === "Dal più popolare"){
                url += `&sort_by=popularity.desc`;
            }else{
                url += `&sort_by=popularity.asc`; //Dal meno popolare
            }
        }
        const response = await fetch(url);
        let data = await response.json();

        let films = data.results.map(film => {
            return {
                _id: film.id,
                title: film.title,
                poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
            }
        })

        if(sortByDate){
            if(sortByDate === "Dal più recente"){
                films = films.sort((a,b) => b.release_year - a.release_year);
            }else{// dal meno recente
                films = films.sort((a,b) => a.release_year - b.release_year);
            }
        }

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
        const { year } = req.params;
        const {page, genre, minRating, sortByPopularity, sortByDate} = req.query;
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY_TMDB}&primary_release_year=${year}&page=${page}&language=en-EN`
        if(genre){
            url += `&with_genres=${genre}`;
        }

        if(minRating !== 0){
            url += `&vote_average.gte=${minRating}`;
        }

        if(sortByPopularity){
            if(sortByPopularity === "Dal più popolare"){
                url += `&sort_by=popularity.desc`;
            }else{
                url += `&sort_by=popularity.asc`; //Dal meno popolare
            }
        }

        const response = await fetch(url);
        let data = await response.json();

        let films = data.results.map( film => {
            return {
                release_date: film.release_date,
                _id: film.id,
                title: film.title,
                poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
            }}
        )

        if(sortByDate){
            if(sortByDate === "Dal più recente"){
                films = films.sort((a,b) => {
                    const dateA = new Date(a.release_date);
                    const dateB = new Date(b.release_date);
                    return dateB - dateA;
                })
            }else{// dal meno recente
                films = films.sort((a,b) => {
                    const dateA = new Date(a.release_date);
                    const dateB = new Date(b.release_date);
                    return dateA - dateB;
                });
            }
        }

        data = { films: films, totalPages: data.total_pages }
        res.status(200).json(data); //invio l'array dei film e il numero totali di pagine
    }catch(error){
        res.status(200).json("Errore nel caricamento dei film")
    }

}
//questa funzione serve per trovare un film conoscendo il suo ID di tmdb e il suo titolo, restituendo tutte le informazioni che
//dovranno essere mostrate nella filmPage

exports.getCast = async (req, res) => {
    const filmID = parseInt(req.params.filmID);
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
    const credits = await creditsResponse.json();
    let cast = credits.cast.map( actor => {
        return {...actor, profile_path: getImageUrl(process.env.baseUrl, "w500", actor.profile_path) }
    })
    res.status(200).json(cast);
}

exports.getCrew = async (req, res) => {
    const filmID = parseInt(req.params.filmID);
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
    const credits = await creditsResponse.json();
    let crew = credits.crew.map( crewMember => {
        return {...crewMember, profile_path: getImageUrl(process.env.baseUrl, "w500", crewMember.profile_path) }
    })
    res.status(200).json(crew);
}

exports.getFilm = async (req, res) => {
    const filmID = parseInt(req.params.filmID);
    const userID = req.user.id;
    let user = await User.findById(userID).populate('reviews').populate('lists');

    let response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}?api_key=${process.env.API_KEY_TMDB}`);
    let film = await response.json();


    //trovo il regista e modifico la data d'uscita del film
    const director = await getFilmDirector(filmID); //oppure film.id
    const year = film.release_date ? new Date(film.release_date).getFullYear() : null;


    //calcola il rating medio del film e quello inserito dlal'utente durante la recensione
    const {avgRating, userRating} = getRating(user, film, filmID);

    //trovo il link Youtube del trailer
    const trailerLink = await getFilmTrailer(filmID);

    //trovo le recensioni più popolari del film
    const reviews = await getUserReviews(filmID);
    console.log(reviews);

    //calcolo la durata del film in ore + minuti (film.runtime restituisce la durata in minuti)
    const hours = Math.floor(film.runtime / 60);
    const minutes = film.runtime % 60;
    const duration = `${hours}h ${minutes}m`;

    //controllo se il film è in watchlist, nei film piaciuti, se è stato recensito, aggiutno tra i preferiti o tra i film visti
    const status = getFilmStatus(user, filmID);

    //ottengo i dettagli del film
    let filmDetails = {
        production_companies: film.production_companies.map( e => { return {name: e.name, country: e.origin_country}} ),
        origin_country: film.origin_country,
        original_language: film.original_language,
        spoken_languages: film.spoken_languages.map(e => e.english_name),
        budget: film.budget,
        revenue: film.revenue,
    }

    //trovo la preview del cast e la crew (solo i primi 6 elementi)
    const obj = await getCastCrewPreview(filmID);
    let castPreview = obj.cast;
    let crewPreview = obj.crew;

    //verifico se il film appartiene ad una saga, così da trovare gli altri film della saga
    const collectionFilms = await getCollectionFilms(film)

    //trovo i providers del film
    response = await fetch(`https://api.themoviedb.org/3/movie/${film.id}/watch/providers?api_key=${process.env.API_KEY_TMDB}`);
    const data = await response.json();

    const rent = data.results?.IT?.rent?.map(provider => {
        return {...provider, logo_path: getImageUrl(process.env.baseUrl, "w92", provider.logo_path) }
    })

    const flatrate = data.results?.IT?.flatrate?.map(provider => {
        return {...provider, logo_path: getImageUrl(process.env.baseUrl, "w92", provider.logo_path) }
    })

    const buy = data.results?.IT?.buy?.map(provider => {
        return {...provider, logo_path: getImageUrl(process.env.baseUrl, "w92", provider.logo_path) }
    })


    film = {...film,
        _id: film.id,
        director: director,
        release_year: year,
        poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
        castPreview: castPreview,
        crewPreview: crewPreview,
        trailerLink: trailerLink,
        avgRating: avgRating,
        userRating: userRating,
        genres: film.genres,
        status: status,
        details: filmDetails,
        collection: collectionFilms,
        rent: rent,
        buy: buy,
        flatrate: flatrate,
        duration: duration,
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
            profile_image: getImageUrl(process.env.baseUrl, "w500", data.profile_path)
        }
        //film in cui ha partecipato come attore
        let actorCast = data.movie_credits.cast.map( (film) => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
                character: film.character,
                poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
            }
        })

        //lo ordino per anno di uscita
        actorCast = [...actorCast].sort((a, b) => {
            // Se b ha un anno e a no, b viene prima
            if (b.release_year === null) return -1;
            if (a.release_year === null) return 1;

            // Ordina numericamente in modo decrescente
            return b.release_year - a.release_year; //se è positivo, mette a prima di b; altrimento mette b prima di a
        });


        //film in cui ha partecipato con un ruolo tecnico (sceneggiatore, scrittore, ecc...)
        let actorCrew = data.movie_credits.crew.map( (film) => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
                job: film.job,
                poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
            }
        })

        actorCrew = [...actorCrew].sort((a, b) => {
            if (b.release_year === null) return -1;
            if (a.release_year === null) return 1;

            return b.release_year - a.release_year;
        })

        actorCrew = actorCrew.reduce(( acc, film) => {
            // estraggo l'id del film
            const filmID = film._id;

            // controllo se nell'accumulatore ha già la proprietà per quel film
            if (acc[filmID]) {
                //Se sì, aggiungi il nuovo 'job' all'array 'jobs'
                acc[filmID].jobs.push(film.job);
            } else {
                // Se no, creo una nuova proprietà per il film
                acc[filmID] = {
                    ...film,
                    jobs: [film.job]
                };
                // rimuovo la vecchia proprietà job
                delete acc[filmID].job;
            }
            return acc;
        }, {}); // L'oggetto vuoto {} è il valore iniziale dell'accumulatore

        actorCrew = Object.values(actorCrew);

        const actor = {
            personalInfo: actorPersonalInfo,
            cast: actorCast, //film in cui la persona ha svolto un ruolo di attore
            crew: actorCrew //film in cui la persona ha svotlo un ruolo più tecnico (sceneggiatore, scrittore, ecc...)
        }

        res.status(200).json(actor);
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
            profile_image: getImageUrl(process.env.baseUrl, "w500", data.profile_path)
        }


        let directorCast = data.movie_credits.cast.map( (film) => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
                character: film.character,
                poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
            }
        })


        directorCast = [...directorCast].sort((a, b) => {
            // Se b ha un anno e a no, b viene prima
            if (b.release_year === null) return -1;
            if (a.release_year === null) return 1;

            // Ordina numericamente in modo decrescente
            return b.release_year - a.release_year; //se è positivo, mette a prima di b; altrimento mette b prima di a
        });

        let directorCrew = data.movie_credits.crew.map( (film) => {
            return {
                _id: film.id,
                title: film.title,
                release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
                job: film.job,
                poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
            }
        })

        directorCrew = [...directorCrew].sort((a, b) => {
            // Se b ha un anno e a no, b viene prima
            if (b.release_year === null) return -1;
            if (a.release_year === null) return 1;

            // Ordina numericamente in modo decrescente
            return b.release_year - a.release_year; //se è positivo, mette a prima di b; altrimento mette b prima di a
        });

        directorCrew = directorCrew.reduce(( acc, film) => {
            // estraggo l'id del film
            const filmID = film._id;

            // controllo se nell'accumulatore ha già la proprietà per quel film
            if (acc[filmID]) {
                //Se sì, aggiungi il nuovo 'job' all'array 'jobs'
                acc[filmID].jobs.push(film.job);
            } else {
                // Se no, creo una nuova proprietà per il film
                acc[filmID] = {
                    ...film,
                    jobs: [film.job]
                };
                // rimuovo la vecchia proprietà job
                delete acc[filmID].job;
            }
            return acc;
        }, {}); // L'oggetto vuoto {} è il valore iniziale dell'accumulatore

        directorCrew = Object.values(directorCrew); //trasformo tra un oggetto che contiene altri oggetti in un array di oggetti
        const directorInfo = {
            personalInfo: directorPersonalInfo,
            cast: directorCast, //film in cui la persona ha svolto un ruolo di attore
            crew: directorCrew //film in cui la persona ha svotlo un ruolo più tecnico (sceneggiatore, scrittore, ecc...)
        }
        res.status(200).json(directorInfo);

    }catch(error){
        res.status(500).json("Errore interno del server.");
    }
}