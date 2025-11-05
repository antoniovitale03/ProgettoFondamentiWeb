import {Link, useNavigate} from "react-router-dom";
import {Box, Card, CardContent, CardMedia, Grid, IconButton, Rating, Typography} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import "../../CSS/FilmCard.css";

export default function ReviewCard({ review, showRemoveButton, onRemove }){
    const navigate = useNavigate();

    return(
        <Card style={{ marginBottom: 10, height: '100%', width: '100%',backgroundColor:"#a4c3b2ff" }}>
            <CardContent>
                <Grid container spacing={2}>

                    {/* Sezione di sinistra: Locandina + titolo + anno */}
                    <Grid size={4} sx={{ alignItems: 'center' }}>
                        <Box className="box_testo">
                            <Link className="link_card" to={`/film/${review.film.title.replaceAll(" ", "-")}/${review.film._id}`}>
                                <strong>{review.film.title}</strong>
                            </Link>
                            {
                                review.film.release_year &&
                                <Link className="link_card" to={`/films/${review.film.release_year}`}>
                                    <strong>({review.film.release_year})</strong>
                                </Link>
                            }
                        </Box>
                        <CardMedia component="img" image={review.film.poster_path} className="card_media" onClick={ () => navigate(`/film/${review.film.title.replaceAll(" ", "-")}/${review.film._id}`) }/>

                    </Grid>

                    {/* Sezione centrale: testo recensione + voto + data recensione */}
                    <Grid size={7} sx={{ display: 'flex', flexDirection: 'column'}}>
                        <Typography component="strong" sx={{ overflowWrap: 'break-word' }}>
                            {review.review}
                        </Typography>
                                {
                                    review.rating !== 0 ?
                                        <Typography component="strong" sx={{ marginTop: "auto", display: "block" }}>
                                            <Rating value={review.rating} readOnly/>
                                        </Typography>
                                        : <Typography component="strong" sx={{ marginTop: "auto", display: "block" }}>Nessun voto per questa recensione</Typography>
                                }
                            <Typography component="strong" sx={{ display: "block" }}>Data della recensione: {review.review_date}</Typography>

                    </Grid>
                    {
                        showRemoveButton &&
                        <Grid size={1}>
                            <IconButton onClick={ () => onRemove(review.film._id, review.film.title) }>
                                <ClearIcon />
                            </IconButton>
                        </Grid>
                    }
                </Grid>
            </CardContent>
        </Card>
    )
}