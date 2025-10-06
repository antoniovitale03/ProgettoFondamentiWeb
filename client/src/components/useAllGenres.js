import {useEffect, useState} from "react";
import api from "../api";

function useAllGenres() {

    const [genres, setGenres] = useState(null);
    useEffect(() => {
            const fetchGenres = async () => {
                    const response = await api.get("http://localhost:5001/api/films/get-all-genres");
                    const genres = await response.data;
                    setGenres(genres);
            }
            fetchGenres();
            }, [])
    return genres;
}

export default useAllGenres;