import {Box, Rating, Typography} from "@mui/material";

export default function PopularReviews({ reviews }){
    return(
        <Box>
            <Typography sx={{fontSize:{xs:"12px", md:"1.5vw"}, margin:"5px"}}>Le recensioni più popolari</Typography>
            {
                reviews.slice(0, 5).map( review =>
                    <Box sx={{ marginBottom: "3vw" }}>
                        <strong>{review.author}</strong>
                        <Typography component="p">{review.content}</Typography>
                        <Rating value={review.author_details.rating/2} precision={0.5} readOnly />
                        <Typography component="p">
                            {new Date(review.created_at).toLocaleDateString("it-IT", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                            })}
                        </Typography>

                    </Box>
                )
            }
        </Box>
    )
}