import React, {createContext, useContext, useState} from "react";
import api from "../api"

const FilmContext = createContext(null);

export function FilmProvider({ children }) {


    const [searchQuery] = useState(" "); //film cercato dall'utente
    const [filmsFromSearch, setFilmsFromSearch] = useState([]); //lista di film ottenuti dalla ricerca

    //FUNZIONE UTILE PER OTTENERE LE INFO PRINCIPALI DEI FILM DERIVANTI DALLA RICERCA (DA INSERIRE POI NELLE INFO CARD)
    //COPERTINA + NOME FILM + ANNO DI USCITA + REGISTA
    const getFilmsFromSearch = async (title) => {
        const response = await api.post('http://localhost:5001/api/films/get-film-search-results', { title })
        const films = await response.data; //ottengo l'array con tutti i film ottenuti dalla ricerca
        setFilmsFromSearch(films); //aggiungo l'array al contesto
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


    const value = {filmsFromSearch, getFilmsFromSearch, saveReview}
    return <FilmContext.Provider value={value}>{children}</FilmContext.Provider>;
}

 //custom hook
export function useFilm() {
    return useContext(FilmContext);
}