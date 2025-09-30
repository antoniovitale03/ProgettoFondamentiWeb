import {Box, Button, Card, CardContent, CardMedia, Grid, Rating} from "@mui/material";
import {Link} from "react-router-dom";
import * as React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ClearIcon from '@mui/icons-material/Clear';
import MovieIcon from '@mui/icons-material/Movie';
import {useNavigate} from 'react-router-dom';

function FilmCard({ film, showRemoveButton, onRemove }){

    const navigate = useNavigate();

    return(
        <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}> {/* ogni card ha la stessa altezza* e ha la larghezza di tutto il grid Item */}
            <CardContent>
                {/* Contenuto Superiore (Titolo, Anno, Pulsante Rimuovi) */}
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <MovieIcon sx={{ marginRight: 2 }} />
                        <Button component={Link} to={`/film/${film.title.replaceAll(" ", "-")}/${film._id}`}>
                            <strong>{film.title}</strong>
                        </Button>
                        {film.release_year && <Button component={Link} to={`/films/${film.release_year}`}><strong>({film.release_year}) </strong></Button>}
                        {showRemoveButton &&
                            <Button onClick={() => onRemove(film._id, film.title)}>
                                <ClearIcon />
                            </Button>
                        }
                </Box>

                <CardMedia component="img" image={film.poster_path} sx={{width: '100%', aspectRatio: '2 / 3', objectFit: 'cover' }} onClick={ () => navigate(`/film/${film.title.replaceAll(" ", "-")}/${film._id}`)}/>

                { film.director &&
                    <p>Diretto da:
                        <Button component={Link} to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>
                        <strong>{film.director.name}</strong>
                        </Button>
                    </p>
                }

                {film.date && <p>Data di ultima visione: {film.date}</p>}

                { film.job && <p>Ruolo: {film.job}</p> }

                <p>
                    { film.rating === null ? null : <Rating name="rating" value={film.rating} precision={0.5} readOnly /> }

                    { film.isLiked === true ? <ThumbUpIcon /> : null }
                </p>
            </CardContent>
        </Card>
    )
}
export default FilmCard;