import React, {createContext, useContext, useState} from "react";

const FilmContext = createContext(null);

export function FilmProvider({ children }) {


    const [searchQuery, setSearchQuery] = useState(" "); //film cercato dall'utente
    const [filmsFromSearch, setFilmsFromSearch] = useState([]); //lista di film ottenuti dalla ricerca

    //FUNZIONE UTILE PER OTTENERE LE INFO PRINCIPALI DEI FILM DERIVANTI DALLA RICERCA (DA INSERIRE POI NELLE INFO CARD)
    //COPERTINA + NOME FILM + ANNO DI USCITA + REGISTA
    const getFilmsFromSearch = async (title) => {
        setSearchQuery(title);
        const response = await fetch('http://localhost:5001/api/films/get-film-search-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title }),
        });
        const films = await response.json(); //ottengo l'array con tutti i film ottenuti dalla ricerca
        setFilmsFromSearch(films); //aggiungo l'array al contesto
    }

    //trovo il film dall'array generato da getFilmsFromSearch e passo l'oggetto al componente FilmPage
    const getFilm = async (filmTitle, filmID) => {
        filmTitle = filmTitle.replaceAll(" ", "-")
        const response = await fetch(`http://localhost:5001/api/films/getFilm/${filmTitle}/${filmID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
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

    const addToFavorites = async (film) => {
        const response = await fetch('http://localhost:5001/api/films/add-to-favorites', {
            method: 'POST',
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

    const saveReview = async (title, releaseYear, review, rating) => {
        const response = await fetch('http://localhost:5001/api/films/save-review', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title, releaseYear, review, rating }),
            credentials: "include"
        })
        const data = await response.json();
        if (!response.ok) {
            let error = data.message;
            throw new Error(error);
        }
    }

    const addToLiked = async (film) => {
        const response = await fetch('http://localhost:5001/api/films/add-to-liked', {
            method: 'POST',
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

    const addToWatched = async (film) => {
        const response = await fetch('http://localhost:5001/api/films/add-to-watched', {
            method: 'POST',
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

    const getActor = async (actorID) => {
        const response = await fetch(`http://localhost:5001/api/films/get-actor-info/${actorID}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        })
        let actorInfo = await response.json();
        return actorInfo;
    }

    const value = {searchQuery, filmsFromSearch, getFilmsFromSearch, getFilm, addToWatchlist, addToFavorites, saveReview, addToLiked, addToWatched, getActor}
    return <FilmContext.Provider value={value}>{children}</FilmContext.Provider>;
}

 //custom hook
export function useFilm() {
    return useContext(FilmContext);
}