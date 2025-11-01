import {Box, IconButton, Card, CardContent, CardMedia, Rating, Tooltip, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ClearIcon from '@mui/icons-material/Clear';
import MovieIcon from '@mui/icons-material/Movie';
import {useNavigate} from 'react-router-dom';
import "../../CSS/FilmCard.css"

export default function FilmCard({ film, showRemoveButton, onRemove }){

    const navigate = useNavigate();

    return(
        <Card sx={{backgroundColor:"#a4c3b2ff", width:"100%", height:"100%", borderRadius:"10px"}}> {/* ogni card ha la stessa altezza* e ha la larghezza di tutto il grid Item */}
            <CardContent>

                {/* Contenuto Superiore (Titolo, Anno, Pulsante Rimuovi) */}
                <Box className="box_testo">
                        <MovieIcon sx={{marginRight: 2, fontSize:"20px"}} />
                        <Link className="link_card" to={`/film/${film.title.replaceAll(" ", "-")}/${film._id}`}>
                            <strong>{film.title}</strong>
                        </Link>
                        {
                            film.release_year &&
                            <Link className="link_card" to={`/films/${film.release_year}`}>
                                <strong>({film.release_year}) </strong>
                            </Link>
                        }
                        {showRemoveButton &&
                            <Tooltip title="Rimuovi" >
                                <IconButton onClick={() => onRemove(film._id, film.title)}>
                                <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        }
                </Box>

                <CardMedia className="card_media" component="img" image={film.poster_path} onClick={ () => navigate(`/film/${film.title.replaceAll(" ", "-")}/${film._id}`)}/>

                { film.director &&

                    <Box>
                        <Typography component="p" style={{fontFamily:"bold",fontSize:"20px",marginBottom:"0",marginRight:"5px",display:"inline-block",color:"#344e41"}}>Diretto da:</Typography>
                            <Link className="link_card" to={`/director/${film.director.name.replaceAll(" ", "-")}/${film.director.id}`}>
                            <strong>{film.director.name}</strong>
                            </Link>
                    </Box>
                }

                {film.date && <Typography component="p" style={{color:"#344e41"}}>Data di ultima visione: {film.date}</Typography>}

                { film.jobs && <Typography component="p" style={{color:"#344e41"}}>Ruoli: {film.jobs.map( job => <>{job}      </>)}</Typography> }
                
                <Typography component="p">
                    { film.rating && <Rating name="rating" value={film.rating} precision={0.5} readOnly /> }

                    { film.isLiked === true && <ThumbUpIcon /> }
                </Typography>
            </CardContent>
        </Card>
    )
}