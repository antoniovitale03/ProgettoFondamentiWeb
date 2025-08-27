import React, {createContext, useContext, useState} from "react";

const FilmContext = createContext(null);

export function FilmProvider({ children }) {

    const API_KEY_TMDB = "28b872161efc4627e1657874dcc818d5";
    const posterBaseUrl = 'https://image.tmdb.org/t/p/w500' //per ricavare la locandina verticale usare questo url + film.poster_path
    const bannerBaseUrl = 'https://image.tmdb.org/t/p/w1280' // per ricavare lo sfondo orizzontale usare questo url + film.backdrop_path

    const [filmsFromSearch, setFilmsFromSearch] = useState([]); //film ottenuti dalla ricerca

    //FUNZIONE UTILE PER OTTENERE LE INFO PRINCIPALI DEI FILM DERIVANTI DALLA RICERCA (DA INSERIRE POI NELLE INFO CARD)
    //COPERTINA + NOME FILM + ANNO DI USCITA + REGISTA
    const getFilmsFromSearch = async (film) => {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY_TMDB}&query=${film}`);
        const data = await response.json();
        const films = data.results; //ottengo la lista di tutti i film che corrispondono alla ricerca
        //aggiungo ad ogni film la proprietà che riguarda il regista, completo l'url per locandina e sfondo (se esistono) e
        //converto release_date indicando solo l'anno di uscita senza mese e giorno
        const modified_films = await films.map(async (film) => {  //array di Promise
            const director = await getFilmDirector(film.id);
            const poster_image_url = film.poster_path ? posterBaseUrl + film.poster_path : null
            const background_image_url = film.backdrop_path ? bannerBaseUrl + film.backdrop_path : null
            const year = film.release_date ? new Date(film.release_date).getFullYear() : "N/A";
            return{
                ...film,
                director: director,
                poster_path: poster_image_url,
                backdrop_path: background_image_url,
                release_date:year
            };
        });
        const finalFilms = await Promise.all(modified_films)
        setFilmsFromSearch(finalFilms); //aggiungo l'array al contesto solo quando tutte le promise sono finite
    }


    const getFilmDirector = async (filmID)  => {
        // 2. Chiamata per il cast e la troupe
        const creditsResponse = await fetch(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${API_KEY_TMDB}`);
        const credits = await creditsResponse.json();

        // 3. Trova il regista nell'array 'crew'
        const directorObject = credits.crew.find( (member) => member.job === 'Director');

        // 4. Estrai il nome (gestendo il caso in cui non venga trovato)
        const director = directorObject ? directorObject.name : null;
        return director;
    }


    const value = {filmsFromSearch, getFilmsFromSearch}
    return <FilmContext.Provider value={value}>{children}</FilmContext.Provider>;
}
 //custom hook
export function useFilm() {
    const context = useContext(FilmContext);
    // Se un componente prova a usare questo hook senza essere un figlio
    // del Provider, 'context' sarà 'null'.
    if (context === null) {
        throw new Error("useAuth deve essere usato all'interno di un AuthProvider");
    }
    return context;
}