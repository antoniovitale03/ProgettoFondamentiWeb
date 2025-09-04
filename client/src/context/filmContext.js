import React, {createContext, useContext, useState} from "react";
import api from "../api"

const FilmContext = createContext(null);

export function FilmProvider({ children }) {


    const [searchQuery, setSearchQuery] = useState(" "); //film cercato dall'utente
    const [filmsFromSearch, setFilmsFromSearch] = useState([]); //lista di film ottenuti dalla ricerca

    //FUNZIONE UTILE PER OTTENERE LE INFO PRINCIPALI DEI FILM DERIVANTI DALLA RICERCA (DA INSERIRE POI NELLE INFO CARD)
    //COPERTINA + NOME FILM + ANNO DI USCITA + REGISTA
    const getFilmsFromSearch = async (title) => {
        setSearchQuery(title);
        const response = await api.post('http://localhost:5001/api/films/get-film-search-results', {
            title
        })
        const films = await response.data; //ottengo l'array con tutti i film ottenuti dalla ricerca
        setFilmsFromSearch(films); //aggiungo l'array al contesto
    }

    //trovo il film dall'array generato da getFilmsFromSearch e passo l'oggetto al componente FilmPage
    const getFilm = async (filmTitle, filmID) => {
        filmTitle = filmTitle.replaceAll(" ", "-")
        const response = await api.get(`http://localhost:5001/api/films/getFilm/${filmTitle}/${filmID}`);
        const film = await response.data;
        return film;
    }

    const saveReview = async (title, releaseYear, review, rating) => {
        try{
             await api.post('http://localhost:5001/api/films/save-review', {
                title, releaseYear, review, rating
             })
        }catch(error){
            throw new Error(error.response.data)
        }
    }


    const getActor = async (actorID) => {
        const response = await api.get(`http://localhost:5001/api/films/get-actor-info/${actorID}`);
        let actorInfo = await response.data;
        return actorInfo;
    }

    const value = {searchQuery, filmsFromSearch, getFilmsFromSearch, getFilm, saveReview, getActor}
    return <FilmContext.Provider value={value}>{children}</FilmContext.Provider>;
}

 //custom hook
export function useFilm() {
    return useContext(FilmContext);
}