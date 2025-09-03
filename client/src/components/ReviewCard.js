import {useNavigate} from "react-router-dom";
import {Box, Button, Rating, Stack} from "@mui/material";

function ReviewCard( {review} ){
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate(`/film/${review.title}/${review._id}`);
    }
    return(
        <Box>
            <Stack spacing={4}>
                <Button onClick={handleClick}>{review.title}  ({review.release_year})</Button>
                <img src={review.poster_path} alt="Locandina film"/>
                <p>Recensione: {review.review}</p>
                <p>Il voto che hai inserito: {<Rating name="rating" value={review.rating} readOnly/> }</p>
                <p>Data della recensione: {review.review_date}</p>
                <p>-------</p>
            </Stack>
        </Box>
    )
}

export default ReviewCard;