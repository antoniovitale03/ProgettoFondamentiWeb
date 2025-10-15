import FilmCard from "./Cards/FilmCard";
import {Box, Grid, Typography} from "@mui/material";

function FilmCollection({ film }){
    return(
        <Box>
            { film?.collection ?
                <Box>
                    <Typography sx={{fontSize:{xs:"12px", md:"1.5vw"},margin:"5px"}}>La saga completa</Typography>
                    <Grid container spacing={2}>
                        {film?.collection?.map( film =>
                            <Grid key={film._id} xs={12} sm={6} md={4} size={4} >
                                <FilmCard film={film} />
                            </Grid>
                        )}
                    </Grid>
                </Box> : null
            }
        </Box>
    )
}

export default FilmCollection;