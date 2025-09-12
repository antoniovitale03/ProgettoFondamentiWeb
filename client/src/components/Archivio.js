import useDocumentTitle from "./useDocumentTitle";
import DropDownMenu from "./DropDownMenu";
import {Button, FormControl, MenuItem, Rating, TextField} from "@mui/material";
import {React, useState} from "react";
import {useNotification} from "../context/notificationContext";
import api from "../api";

function Archivio(){
    useDocumentTitle("Archivio");
    const {showNotification} = useNotification();

    const [genre, setGenre] = useState(0);
    const [decade, setDecade] = useState(0);
    const [minRating, setMinRating] = useState(0);

    const [archiveFilms, setArchiveFilms] = useState([]);

    let genres = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy",
        "History", "Horror", "Music", "Mystery", "Romance", "Science Fiction", "Thriller", "TV Movie", "War", "Western" ]

    //costruisco l'array delle decadi
    let currentDecade = 2020;
    let decades = [];
    for(let decade = currentDecade; decade >= 1870; decade -= 10){
        decades.push(decade);
    }


    const handleSearchFilm = async (event) => {
        event.preventDefault();
        console.log(decade, genre, minRating);
        try{
            const response = await api.post("http://localhost:5001/api/films/get-archive-films", {
                decade, genre, minRating
            });
            let data = response.data;
            console.log(data);
        }catch(error){
            showNotification("Errore nella ricerca dei film", "error");
        }
    }

    return(
        <div>
            <p>Archivio di tutti i film disponibili</p>
            <p>Similmente alla funzione di ricerca, qui l'utente può trovare dei film non solo a partire dal nome, ma anche dalla data di uscita, genere, popolarità ecc.</p>
            <form onSubmit={handleSearchFilm}>
                <FormControl>
                    <TextField
                        select
                        label="genere"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        variant="standard"
                    >
                        {genres.map( (genre, index) =>
                        <MenuItem key={index} value={genre}>{genre}</MenuItem>
                        )}
                    </TextField>
                </FormControl>

                <FormControl>
                    <TextField
                        select
                        label="decade"
                        value={decade}
                        onChange={(e) => setDecade(e.target.value)}
                        variant="standard"
                    >
                        {decades.map( (decade, index) =>
                        <MenuItem key={index} value={decade}>{decade}</MenuItem>
                        )}
                    </TextField>
                </FormControl>

                <p>Rating minimo: </p>
                <Rating name="review-rating" value={minRating} onChange={(event,minRating) => setMinRating(minRating)} precision={0.5} />
                <Button onClick={handleSearchFilm}>Filtra</Button>

                <p>Ordina per </p>

            </form>

        </div>
    )
}

export default Archivio;