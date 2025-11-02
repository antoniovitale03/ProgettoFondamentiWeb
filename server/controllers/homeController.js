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
        if(userID){
            let user = await User.findById(userID).populate("watched");
            //prendo 4 film casuali visti e per ognuno raccomando 5 film (per un totale di 20 nel carosello)
            var similarFilms = user.watched.sort(() => 0.5 - Math.random()).slice(0,4).map( async (film) => {
                const response = await fetch(`https://api.themoviedb.org/3/movie/${film.id}/similar?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=1`);
                const data = await response.json();
                return formatData(data.results).slice(0,5);
            })
            similarFilms = await Promise.all(similarFilms);
            similarFilms = similarFilms.flat();
        }else{ //l'utente non è loggato
            similarFilms = null;
        }

        let fetchPopular = fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=1`);
        let fetchUpcoming = fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.API_KEY_TMDB}&language=en-EN&region=IT&page=1`);
        let fetchTopRated = fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=1`);
        let fetchNowPlaying = fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY_TMDB}&language=en-EN&region=IT&page=1`);
        let fetchTrending = fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.API_KEY_TMDB}&language=en-EN`);
        const responses = await Promise.all([fetchPopular, fetchUpcoming, fetchTopRated,fetchNowPlaying, fetchTrending]);

        let data = await Promise.all(responses.map(response => response.json()));
        data = data.map(response => formatData(response.results));

        const homePageFilms = {
            currentPopularFilms: data[0],
            upcomingFilms: data[1],
            topRatedFilms: data[2],
            nowPlayingFilms: data[3],
            trendingFilms: data[4],
            similarFilms: similarFilms
        }
        res.status(200).json(homePageFilms);
    }catch(error){ res.status(500).json("Errore interno del server"); }
}

exports.getCurrentPopularFilms = async (req, res) => {
    const pageNumber = req.params.pageNumber;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${pageNumber}`);
        const data = await response.json();
        res.status(200).json({ films: formatData(data.results), totalPages: data.total_pages });
    }catch(error){ res.status(500).json("Errore interno del server"); }
}

exports.getUpcomingFilms = async (req, res) => {
    const pageNumber = req.params.pageNumber;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${process.env.API_KEY_TMDB}&language=en-EN&region=IT&page=${pageNumber}`);
        let data = await response.json();
        res.status(200).json({ films: formatData(data.results), totalPages: data.total_pages });
    }catch(error){ res.status(500).json("Errore interno del server");}
}

exports.getTopRatedFilms = async (req, res) => {
    const pageNumber = req.params.pageNumber;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.API_KEY_TMDB}&language=it-IT&page=${pageNumber}`);
        let data = await response.json();
        res.status(200).json({ films: formatData(data.results), totalPages: data.total_pages });
    }catch(error){ res.status(500).json("Errore interno del server"); }
}

exports.getNowPlayingFilms = async (req, res) => {
    const pageNumber = req.params.pageNumber;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.API_KEY_TMDB}&language=en-EN&region=IT&page=${pageNumber}`);
        let data = await response.json();
        res.status(200).json({ films: formatData(data.results), totalPages: data.total_pages });
    }catch(error){ res.status(500).json("Errore interno del server"); }

}

exports.getTrendingFilms = async (req, res) => {
    const pageNumber = req.params.pageNumber;
    try{
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.API_KEY_TMDB}&language=en-EN&page=${pageNumber}`);
        let data = await response.json();
        res.status(200).json({ films: formatData(data.results), totalPages: data.total_pages });
    }catch(error){ res.status(500).json("Errore interno del server"); }
}