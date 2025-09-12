import {Link} from "react-router-dom";
import {Button, Card, CardContent, CardMedia, Grid, Rating, Typography} from "@mui/material";
import * as React from "react";

function ReviewCard({ review }){
    return(
        <Card style={{ marginBottom: 12 }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item size={4}>
                        <p>
                        <Button component={Link} to={`/film/${review.title}/${review._id}`}>
                            <strong>{review.title}</strong></Button>
                        {review.release_year ?
                            <Button component={Link} to={`/films/${review.release_year}/page/1`}>
                                <strong>     ({review.release_year})</strong>
                            </Button> : null
                        }
                        </p>
                        <Button component={Link} to={`/film/${review.title}/${review._id}`}>
                            <CardMedia component="img" image={review.poster_path} alt="Locandina film"/>
                        </Button>
                    </Grid>
                    <Grid item size={8}>
                        <Typography component="p" sx={{ overflowWrap: 'break-word' }}>{review.review}</Typography>
                        <Typography component="p">Il tuo voto: {<Rating name="rating" value={review.rating} readOnly/> }</Typography>
                        <Typography component="p">Data della recensione: {review.review_date}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default ReviewCard;