import {useEffect, useState} from "react";
import api from "../../api";

export default function useAllGenres() {

    const [genres, setGenres] = useState(null);
    useEffect(() => {
        api.get(`${process.env.REACT_APP_SERVER}/api/films/get-all-genres`)
            .then(response => setGenres(response.data))
            .catch(error => console.log(error));
        }, [])
    return genres;
}