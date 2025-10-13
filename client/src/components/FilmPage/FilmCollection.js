import FilmCard from "../Cards/FilmCard";
import {Box, Grid} from "@mui/material";

function FilmCollection({ collection }){
    return(
        <Box>
            { collection &&
                <Box>
                    <p>La saga completa</p>
                    <Grid container spacing={2}>
                        {collection.map( film =>
                            <Grid key={film._id} size={{xs: 12, sm: 6, md: 4, lg:3}}>
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