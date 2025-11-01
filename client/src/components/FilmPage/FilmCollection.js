import FilmCard from "../Cards/FilmCard";
import {Box, Grid, Typography} from "@mui/material";

export default function FilmCollection({ collection }){
    return(
        <Box>
            <Typography sx={{fontSize:{xs:"12px", md:"1.5vw"},margin:"5px"}}>La saga completa</Typography>
            <Grid container spacing={2}>
                {collection?.map( film =>
                    <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
                        <FilmCard film={film} />
                    </Grid>
                )}
            </Grid>
        </Box>
    )
}