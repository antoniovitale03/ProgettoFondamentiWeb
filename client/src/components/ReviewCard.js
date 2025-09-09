import {Link, useNavigate} from "react-router-dom";
import {Box, Rating, Stack} from "@mui/material";
import * as React from "react";

function ReviewCard( {review} ){

    return(
        <Box sx={{ marginBottom: '70px' }}>
            <Stack spacing={3}>
                <Link to={`/film/${review.title}/${review._id}`}>{review.title}</Link>
                {review.release_year ?
                    <Link to={`/films/${review.release_year}/page/1`}>({review.release_year})</Link> : null
                }
                <img src={review.poster_path} alt="Locandina film"/>
                <p>Recensione: {review.review}</p>
                <p>Il voto che hai inserito: {<Rating name="rating" value={review.rating} readOnly/> }</p>
                <p>Data della recensione: {review.review_date}</p>
            </Stack>
        </Box>
    )
}

export default ReviewCard;