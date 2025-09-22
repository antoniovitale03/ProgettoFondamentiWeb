const User = require("../models/User");

function formatData(arrayFilm){
    return arrayFilm.map(film => {
        return {
            _id: film.id,
            title: film.title,
            release_year: film.release_date ? new Date(film.release_date).getFullYear() : null,
            poster_path: film.poster_path ? process.env.posterBaseUrl + film.poster_path : process.env.greyPosterUrl
        }
    });
}
//ottengo tutte le info dei film e li inserisco nella homePage
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
        data.results = formatData(data.results);
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
        data.results = formatData(data.results);
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
        data.results = formatData(data.results);
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
        data.results = formatData(data.results);
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
        data.results = formatData(data.results);
        res.status(200).json(data);
    }catch(error){
        res.status(500).json("Errore interno del server");
    }
}