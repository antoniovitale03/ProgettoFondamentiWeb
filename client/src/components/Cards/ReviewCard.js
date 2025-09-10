import {Link} from "react-router-dom";
import {Button, Card, CardContent, CardMedia, Rating} from "@mui/material";
import * as React from "react";

function ReviewCard( {review} ){
    return(
        <Card style={{ marginBottom: 12 }}>
            <CardContent>
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
                <p>{review.review}</p>
                <p>Il tuo voto: {<Rating name="rating" value={review.rating} readOnly/> }</p>
                <p>Data della recensione: {review.review_date}</p>
            </CardContent>
        </Card>
    )
}

export default ReviewCard;