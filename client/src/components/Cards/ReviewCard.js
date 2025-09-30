import {Link} from "react-router-dom";
import {Box, Button, Card, CardContent, CardMedia, Grid, Rating, Typography} from "@mui/material";
import * as React from "react";
import ClearIcon from '@mui/icons-material/Clear';

function ReviewCard({ review, showRemoveButton, onRemove }){
    return(
        <Card style={{ marginBottom: '12px', height: '100%', width: '100%', padding: 12 }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item size={4}>
                        <p>
                        <Button component={Link} to={`/film/${review.title}/${review.filmID}`}>
                            <strong>{review.title}</strong></Button>
                        {review.release_year &&
                            <Button component={Link} to={`/films/${review.release_year}/page/1`}>
                                <strong>     ({review.release_year})</strong>
                            </Button>
                        }
                        </p>
                        <Button component={Link} to={`/film/${review.title}/${review.filmID}`}>
                            <CardMedia component="img" image={review.poster_path} alt="Locandina film"/>
                        </Button>
                    </Grid>
                    <Grid item size={7} sx={{ display: 'flex', flexDirection: 'column'}}>
                        <Typography component="p" sx={{ overflowWrap: 'break-word' }}>{review.review}</Typography>
                        <Box sx={{ marginTop: 'auto'}}>
                            <Typography component="p">Il tuo voto: {<Rating name="rating" value={review.rating} readOnly/> }</Typography>
                            <Typography component="p">Data della recensione: {review.review_date}</Typography>
                        </Box>

                    </Grid>
                    {
                        showRemoveButton &&
                        <Grid item size={1}>
                            <Button onClick={ () => onRemove(review.filmID, review.title) }>
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