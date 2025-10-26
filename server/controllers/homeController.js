const User = require("../models/User");

//funzione che calcola l'url delle immagini
function getImageUrl(baseUrl, size, imagePath){
    if(imagePath){
        return `${baseUrl}/${size}/${imagePath}`;
    }else{
        const width = parseInt(size.slice(1)); //w500 -> 500
        const height = Math.round(width * 1.5);
        return `https://placehold.co/${width}x${height}/EFEFEF/EFEFEF`;
    }
}

function formatData(arrayFilm){
    return arrayFilm.map(film => {
        return {
            _id: film.id,
            title: film.title,
            release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
            poster_path: getImageUrl(process.env.baseUrl, "w500", film.poster_path),
        }
    });
}

//ottengo tutte le info dei film e li inserisco nella homePage
exports.getHomePageFilms = async (req, res) => {
    try{
        let {userID} = req.query;
        if(userID){ //la richiesta è stata fatta da un utente loggato
            //trovo i film simili a quelli già visti
            let user = await User.findById(userID).populate("watched");
            //ottengo i film visti per poter prendere 4 film casuali visti e per ognuno raccomandare 5 film (questo vale solo per il carosello, che
            //ha un numero limitato di 20 film in modo che ad ogni caricamento mostro film raccomandati diversi)
            var similarFilms = user.watched.sort(() => 0.5 - Math.random()).slice(0,4).map( async (film) => {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${film.id}/similar?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=1`);
                const data = await response.json();
                return formatData(data.results).slice(0,5)
            })
            similarFilms = await Promise.all(similarFilms);
            similarFilms = similarFilms.flat();
        }else{ //l'utente non è loggato
            similarFilms = null;
        }

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
            film.results = formatData(film.results);
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
    }catch(error){ res.status(500).json("Errore interno del server"); }
}

//funzioni utilizzate per mostrare i film più nel dettaglio nella singola componente, in base al numero di pagina
exports.getCurrentPopularFilms = async (req, res) => {
    const {pageNumber} = req.params;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${pageNumber}`);
        const data = await response.json();
        res.status(200).json({ films: formatData(data.results), totalPages: data.total_pages });
    }catch(error){ res.status(500).json("Errore interno del server"); }
}

exports.getUpcomingFilms = async (req, res) => {
    const {pageNumber} = req.params;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.API_KEY_TMDB}&language=en-EN&region=IT&page=${pageNumber}`);
        let data = await response.json();
        res.status(200).json({ films: formatData(data.results), totalPages: data.total_pages });
    }catch(error){ res.status(500).json("Errore interno del server");}
}

exports.getTopRatedFilms = async (req, res) => {
    const {pageNumber} = req.params;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY_TMDB}&language=it-IT&page=${pageNumber}`);
        let data = await response.json();
        res.status(200).json({ films: formatData(data.results), totalPages: data.total_pages });
    }catch(error){ res.status(500).json("Errore interno del server"); }
}

exports.getNowPlayingFilms = async (req, res) => {
    const {pageNumber} = req.params;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY_TMDB}&language=en-EN&region=IT&page=${pageNumber}`);
        let data = await response.json();
        res.status(200).json({ films: formatData(data.results), totalPages: data.total_pages });
    }catch(error){ res.status(500).json("Errore interno del server"); }

}

exports.getTrendingFilms = async (req, res) => {
    const {pageNumber} = req.params;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${pageNumber}`);
        let data = await response.json();
        res.status(200).json({ films: formatData(data.results), totalPages: data.total_pages });
    }catch(error){ res.status(500).json("Errore interno del server"); }
}