import {Box, Button, Card, CardContent, CardMedia, Rating, Stack} from "@mui/material";
import {NavLink, useNavigate, Link} from "react-router-dom";
import * as React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

function FilmCard({ film }){
    const navigate = useNavigate();
    const title = film.title.replaceAll(" ", "-"); //se ci sono spazi nel titolo del film li sostituisco con i trattini
    //es. The Matrix reindirizza all'url /film/The-Matrix piuttosto ch /film/The%Matrix



    return(
        <Card style={{ marginBottom: '20px' }}>
            <CardContent>
                <p>
                    <Button component={Link} to={`/film/${title}/${film._id}`}>
                        <strong>{film.title}</strong>
                    </Button>
                    {film.release_year ?
                        <Button component={Link} to={`/films/${film.release_year}`}><strong>({film.release_year}) </strong></Button> : null
                    }
                </p>
                <Button component={Link} to={`/film/${title}/${film._id}`}>
                    <CardMedia component="img" image={film.poster_path} />
                </Button>
                { film.director ? <p>Diretto da: <Button to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>
                        <strong>{film.director.name}</strong>
                    </Button></p>
                    : null }

                {film.date ? <p>Data della visione: {film.date}</p> : null}

                { film.job ? <p>Ruolo: {film.job}</p> : null }

                <p>
                    { film.rating === null ? null :
                        film.rating === undefined ? null :
                            <Rating name="rating" value={film.rating} precision={0.5} readOnly />
                    }

                    { film.isLiked === true ? <ThumbUpIcon /> : null }
                </p>
            </CardContent>
        </Card>
    )
}
export default FilmCard;