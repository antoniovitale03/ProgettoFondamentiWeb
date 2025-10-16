import {Link} from "react-router-dom";
import {Box, Button, Card, CardContent, CardMedia, Grid, Rating, Typography} from "@mui/material";
import * as React from "react";
import ClearIcon from '@mui/icons-material/Clear';

function ReviewCard({ review, showRemoveButton, onRemove }){
    return(
        <Card style={{ marginBottom: 10, height: '100%', width: '100%' }}>
            <CardContent>
                <Grid container spacing={2}>

                    <Grid size={4}>
                        <p>
                        <Button component={Link} to={`/film/${review.film.title.replaceAll(" ", "-")}/${review.film._id}`}>
                            <strong>{review.film.title} </strong></Button>
                        {
                            review.film.release_year &&
                            <Button component={Link} to={`/films/${review.film.release_year}`}>
                                <strong>     ({review.film.release_year})</strong>
                            </Button>
                        }
                        </p>
                        <Button component={Link} to={`/film/${review.film.title.replaceAll(" ", "-")}/${review.film._id}`}>
                            <CardMedia component="img" image={review.film.poster_path} alt="Locandina film"/>
                        </Button>
                    </Grid>

                    <Grid size={7} sx={{ display: 'flex', flexDirection: 'column'}}>
                        <Typography component="p" sx={{ overflowWrap: 'break-word' }}>{review.review}</Typography>
                        <Box sx={{ marginTop: 'auto'}}>
                                {
                                    review.rating !== 0 ?
                                        <Typography component="p">Il tuo voto: {<Rating name="rating" value={review.rating} readOnly/> }</Typography>
                                        : <Typography component="p">Nessun voto per questa recensione</Typography>
                                }
                            <Typography component="p">Data della recensione: {review.review_date}</Typography>
                        </Box>

                    </Grid>
                    {
                        showRemoveButton &&
                        <Grid size={1}>
                            <Button onClick={ () => onRemove(review.film._id, review.film.title) }>
                                <ClearIcon />
                            </Button>
                        </Grid>
                    }
                </Grid>
            </CardContent>
        </Card>
    )
}

export default ReviewCard;