import {Button, Card, CardContent, CardMedia, Grid, Rating} from "@mui/material";
import {Link} from "react-router-dom";
import * as React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ClearIcon from '@mui/icons-material/Clear';
import {useNavigate} from 'react-router-dom';

function FilmCard({ film, showRemoveButton, onRemove }){

    const navigate = useNavigate();

    const filmTitle = film.title.replaceAll(" ", "-"); //se ci sono spazi nel titolo del film li sostituisco con i trattini
    //es. The Matrix reindirizza all'url /film/The-Matrix piuttosto ch /film/The%Matrix


    return(
        <Card sx={{ minHeight: '100%' }}> {/* ogni card ha la stessa altezza*/}
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item size={10}>
                    <p>
                    <Button component={Link} to={`/film/${filmTitle}/${film._id}`}>
                        <strong>{film.title}</strong>
                    </Button>
                    {film.release_year ?
                        <Button component={Link} to={`/films/${film.release_year}`}><strong>({film.release_year}) </strong></Button> : null
                    }
                    </p>
                    </Grid>

                    <Grid item size={2}>
                        <p>
                            {showRemoveButton ?
                                <Button onClick={() => onRemove(film._id, film.title)}>
                                    <ClearIcon />
                                </Button> : null
                            }
                        </p>
                    </Grid>
                </Grid>

                <CardMedia component="img" image={film.poster_path} sx={{ objectFit: 'cover' }} onClick={ () => navigate(`/film/${filmTitle}/${film._id}`)}/>


                { film.director ?
                    <p>Diretto da:
                        <Button component={Link} to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>
                        <strong>{film.director.name}</strong>
                        </Button>
                    </p>
                    : null
                }

                {film.date ? <p>Data di ultima visione: {film.date}</p> : null}

                { film.job ? <p>Ruolo: {film.job}</p> : null }

                <p>
                    { film.rating === null ? null : <Rating name="rating" value={film.rating} precision={0.5} readOnly /> }

                    { film.isLiked === true ? <ThumbUpIcon /> : null }
                </p>
            </CardContent>
        </Card>
    )
}
export default FilmCard;