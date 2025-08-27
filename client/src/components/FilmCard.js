import {Container, Box} from "@mui/material";
function FilmCard({film}){
    return(
        <Container>
            <Box>
                <p>{film.title}</p>
                <img src={film.poster_path} alt="Locandina film"/>
                <p>{film.release_date}</p>
                <p>{film.director}</p>
                <p>-------</p>
            </Box>
        </Container>

    )
}
export default FilmCard;