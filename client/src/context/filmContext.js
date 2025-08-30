import React, {createContext, useContext, useEffect, useState} from "react";

const FilmContext = createContext(null);

export function FilmProvider({ children }) {


    const [searchQuery, setSearchQuery] = useState(" "); //film cercato dall'utente
    const [filmsFromSearch, setFilmsFromSearch] = useState([]); //lista di film ottenuti dalla ricerca

    //FUNZIONE UTILE PER OTTENERE LE INFO PRINCIPALI DEI FILM DERIVANTI DALLA RICERCA (DA INSERIRE POI NELLE INFO CARD)
    //COPERTINA + NOME FILM + ANNO DI USCITA + REGISTA
    const getFilmsFromSearch = async (film) => {
        setSearchQuery(film);
        const response = await fetch('http://localhost:5001/api/films/getFilmSearchResults', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ film }),
        });
        const films = await response.json(); //ottengo l'array con tutti i film ottenuti dalla ricerca
        setFilmsFromSearch(films); //aggiungo l'array al contesto
    }

    //trovo il film dall'array generato da getFilmsFromSearch e passo l'oggetto al componente FilmPage
    const findFilm = async (filmTitle, filmID) => {
        const response = await fetch('http://localhost:5001/api/films/findFilm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filmTitle, filmID })
        })
        const film = await response.json();
        return film;
    }

    const addToWatchlist = async (film) => {
        const response = await fetch("http://localhost:5001/api/films/add-to-watchlist", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ film }),
            credentials: 'include'
        })
        const data = await response.json();
        if (!response.ok) {
            let error = data.message;
            throw new Error(error);
        }
    }

    const value = {searchQuery, filmsFromSearch, getFilmsFromSearch, findFilm, addToWatchlist}
    return <FilmContext.Provider value={value}>{children}</FilmContext.Provider>;
}

 //custom hook
export function useFilm() {
    return useContext(FilmContext);
}