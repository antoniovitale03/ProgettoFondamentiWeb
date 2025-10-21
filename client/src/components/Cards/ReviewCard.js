import {Link} from "react-router-dom";
import {Box, Button, Card, CardContent, CardMedia, Grid, IconButton, Rating, Typography} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

function ReviewCard({ review, showRemoveButton, onRemove }){
    return(
        <Card style={{ marginBottom: 10, height: '100%', width: '100%' }}>
            <CardContent>
                <Grid container spacing={2}>

                    {/* Sezione di sinistra: Locandina + titolo + anno */}
                    <Grid size={4} sx={{ alignItems: 'center' }}>
                            <Button component={Link} to={`/film/${review.film.title.replaceAll(" ", "-")}/${review.film._id}`}>
                                <strong>{review.film.title} </strong></Button>
                            {
                                review.film.release_year &&
                                <Button component={Link} to={`/films/${review.film.release_year}`} sx={{ display: 'inline' }}>
                                    <strong>     ({review.film.release_year})</strong>
                                </Button>
                            }
                            <Button component={Link} to={`/film/${review.film.title.replaceAll(" ", "-")}/${review.film._id}`}>
                                <CardMedia component="img" image={review.film.poster_path} />
                            </Button>

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

export default ReviewCard;