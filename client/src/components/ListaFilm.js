import useDocumentTitle from "./useDocumentTitle";
import {useEffect, useState} from "react";
import FilmCard from "./FilmCard";
function ListaFilm(){
    useDocumentTitle("Lista film")


    return(
        <div>
            <p>Qui inseriamo tutti i film visti dall'utente (locandina + voto(in stelle o numero) + eventuale like)</p>
            <p>L'utente può filtrare i film per genere, rating, film piaciuti (con like == true) e, se fosse possibile, la decade di uscita (1980s, 1990s, 2000s,...)</p>
        </div>
    )
}

export default ListaFilm;