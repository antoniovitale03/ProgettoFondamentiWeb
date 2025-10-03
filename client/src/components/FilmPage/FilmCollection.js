import FilmCard from "../Cards/FilmCard";
import {Box, Grid} from "@mui/material";

function FilmCollection({ film }){
    return(
        <Box>
            { film.collection &&
                <Box>
                    <p>La saga completa</p>
                    <Grid container spacing={2}>
                        {film?.collection?.map( film =>
                            <Grid key={film._id} size={2}>
                                <FilmCard film={film} />
                            </Grid>
                        )}
                    </Grid>
                </Box>
            }
        </Box>
    )
}

export default FilmCollection;