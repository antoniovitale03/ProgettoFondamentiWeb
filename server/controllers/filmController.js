
const User = require('../models/User');

function formatData(array){
    return array.map(film => {
        return {
            _id: film.id,
            title: film.title,
            release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
            poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
        }
    });
}

//funzione che calcola l'url delle immagini seguendo le regole dell'api TMDB
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
    const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
    const credits = await creditsResponse.json();

    const directorObject = credits.crew.find( (member) => member.job === 'Director');

    return directorObject ? {name: directorObject.name, id: directorObject.id} : null;
}


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


async function getFilmTrailer(filmID) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/videos?api_key=${process.env.API_KEY_TMDB}&language=en-EN`);
    let data = await response.json();
    let youtubeTrailerObj = data.results.find( video => video.site === 'YouTube' && video.type === 'Trailer');
    if (youtubeTrailerObj) {
        let key = youtubeTrailerObj.key;
        return `https://www.youtube.com/watch?v=${key}`;
    }else{ return null }
}

function getRating(user, film, filmID){
    let avgRating = (film.vote_average)/2; //rating in quinti
    avgRating = avgRating !== 0 ? Number(avgRating.toFixed(1)) : null;  //lo blocco ad una cifra decimale (se è 0 lo setto a null)

    let review = user.reviews.find( review => review.film === filmID);
    let userRating = review !== undefined ? review.rating : null;
    return {avgRating, userRating};
}

async function getCollectionFilms(film){
    if (film.belongs_to_collection){
        let collectionID = film.belongs_to_collection.id;
        let response = await fetch(`https://api.themoviedb.org/3/collection/${collectionID}?api_key=${process.env.API_KEY_TMDB}&language=en-EN`);
        let data = await response.json();
        return formatData(data.parts);
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

//async function getUserReviews(filmID){
    //const response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/reviews?api_key=${process.env.API_KEY_TMDB}&language=en-EN`);
    //return await response.json();

exports.getSimilarFilms = async (req, res) => {
    try{
        const {page, filmID} = req.query;
        const response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/similar?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${page}`);
        let data = await response.json();
        res.status(200).json({films: formatData(data.results), totalPages: data.total_pages});
    }catch(error){ res.status(500).json("Errore interno del server"); }
}

exports.getAllGenres = async (req, res) => {
    try{
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.API_KEY_TMDB}&language=en-EN`);
        const data = await response.json();
        res.status(200).json(data.genres);
    }catch(error){ res.status(500).json("Errore interno del server"); }
}

exports.getFilmsFromSearch = async (req, res) => {
    const filmTitle = req.params.filmTitle;
    const {genre, decade, minRating, sortByDate, sortByPopularity} = req.query;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY_TMDB}&query=${filmTitle}`);
    const data = await response.json();
    let films = data.results;
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

    let filteredFilms = films
        .filter( film => film.release_year) //prendo tutti i film con una data di uscita
        .filter( film => !genre || film.genre_ids.includes(parseInt(genre)))
        .filter( film => !decade || film.release_year >= parseInt(decade) && film.release_year <= parseInt(decade) + 9 )
        .filter( film => !minRating || (film.vote_average)/2 <= parseInt(minRating));

    if(sortByDate === "Dal più recente") filteredFilms = filteredFilms.sort((a,b) => b.release_year - a.release_year);
    if(sortByDate === "Dal meno recente") filteredFilms = filteredFilms.sort((a,b) => a.release_year - b.release_year);

    if (sortByPopularity === "Dal più popolare") filteredFilms = filteredFilms.sort((a,b) => b.popularity - a.popularity);
    if (sortByPopularity === "Dal meno popolare") filteredFilms = filteredFilms.sort((a,b) => a.popularity - b.popularity);

    res.status(200).json(filteredFilms);
}

exports.getArchiveFilms = async (req, res) => {
    try{
        const {page, genre, decade, minRating, sortByPopularity, sortByDate} = req.query;
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${page}`;

        if (genre) url += `&with_genres=${genre}`

        if(decade){
            let firstYear = parseInt(decade);
            let lastYear = firstYear + 9;
            url += `&primary_release_date.gte=${firstYear}-01-01&primary_release_date.lte=${lastYear}-12-31`;
        }

        if (minRating !== 0) url += `&vote_average.gte=${minRating}`;

        if (sortByPopularity === "Dal più popolare") url += `&sort_by=popularity.desc`;
        if (sortByPopularity === "Dal meno popolare") url += `&sort_by=popularity.asc`;

        const response = await fetch(url);
        let data = await response.json();

        let films = formatData(data.results);

        if(sortByDate === "Dal più recente") films = films.sort((a,b) => b.release_year - a.release_year);
        if(sortByDate === "Dal meno recente") films = films.sort((a,b) => a.release_year - b.release_year);

        res.status(200).json({ films: films, totalPages: data.total_pages });
    }catch(error){
        res.status(500).json("Errore interno del server");
    }
}

exports.getFilmsByYear = async (req, res) => {
    try{
        const { year } = req.params;
        const {page, genre, minRating, sortByPopularity, sortByDate} = req.query;
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY_TMDB}&primary_release_year=${year}&page=${page}&language=en-EN`
        if(genre) url += `&with_genres=${genre}`

        if(minRating !== 0) url += `&vote_average.gte=${minRating}`

        if (sortByPopularity === "Dal più popolare") url += `&sort_by=popularity.desc`;
        if (sortByPopularity === "Dal meno popolare") url += `&sort_by=popularity.asc`;

        const response = await fetch(url);
        let data = await response.json();

        let films = formatData(data.results);

        if(sortByDate === "Dal più recente"){
            films = films.sort((a,b) => {
                const dateA = new Date(a.release_date);
                const dateB = new Date(b.release_date);
                return dateB - dateA;
            })
        }
        if (sortByDate === "Dal meno recente"){
            films = films.sort((a,b) => {
                const dateA = new Date(a.release_date);
                const dateB = new Date(b.release_date);
                return dateA - dateB
            })
        }

        data = { films: films, totalPages: data.total_pages }
        res.status(200).json(data); //invio l'array dei film e il numero totali di pagine
    }catch(error){ res.status(500).json("Errore nel caricamento dei film") }

}

exports.getCast = async (req, res) => {
    try{
        const filmID = parseInt(req.params.filmID);
        const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
        const credits = await creditsResponse.json();
        let cast = credits.cast.map( actor => {
            return {...actor, profile_path: getImageUrl(process.env.baseUrl, "w500", actor.profile_path) }
        })
        res.status(200).json(cast);
    }catch(error){ res.status(500).json("Errore nel caricamento dei film") }
}

exports.getCrew = async (req, res) => {
    try{
        const filmID = parseInt(req.params.filmID);
        const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY_TMDB}`);
        const credits = await creditsResponse.json();
        let crew = credits.crew.map( crewMember => {
            return {...crewMember, profile_path: getImageUrl(process.env.baseUrl, "w500", crewMember.profile_path) }
        })
        res.status(200).json(crew);
    }catch(error){ res.status(500).json("Errore nel caricamento dei film") }
}

exports.getFilm = async (req, res) => {
    try{
        const filmID = parseInt(req.params.filmID);
        const userID = req.user.id;
        let user = await User.findById(userID).populate('reviews').populate('lists');

        let response = await fetch(`https://api.themoviedb.org/3/movie/${filmID}?api_key=${process.env.API_KEY_TMDB}`);
        let film = await response.json();

        const director = await getFilmDirector(filmID); //oppure film.id
        const year = film.release_date ? new Date(film.release_date).getFullYear() : null;

        const {avgRating, userRating} = getRating(user, film, filmID);

        const trailerLink = await getFilmTrailer(filmID);

        //trovo le recensioni più popolari del film (funzionalità futura)
        //const reviews = await getUserReviews(filmID);
        //console.log(reviews);

        const hours = Math.floor(film.runtime / 60);
        const minutes = film.runtime % 60;
        const duration = `${hours}h ${minutes}m`;

        const status = getFilmStatus(user, filmID);

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

        const collectionFilms = await getCollectionFilms(film)

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
    }catch(error){ res.status(500).json("Errore nel caricamento della pagina del film") }
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
            profile_image: getImageUrl(process.env.baseUrl, "w500", data.profile_path)
        }

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

        res.status(200).json({personalInfo: actorPersonalInfo, cast: actorCast, crew: actorCrew});
    }catch(error){ res.status(500).json("Errore interno del server."); }
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
        res.status(200).json({personalInfo: directorPersonalInfo, cast: directorCast, crew: directorCrew});

    }catch(error){ res.status(500).json("Errore interno del server."); }
}