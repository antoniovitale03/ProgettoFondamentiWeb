import {useLocation, useParams} from "react-router-dom";
import ActorCard from "./Cards/ActorCard"
import useDocumentTitle from "./useDocumentTitle";
import {Grid} from "@mui/material";
// /films/filmTitle/filmID/cast
function CastPage(){
    const {filmTitle} = useParams()

    const location = useLocation();
    const cast = location.state?.cast;

    useDocumentTitle(`Cast di "${filmTitle}"`);
    return(
        <div>
            <h1>Cast di "{filmTitle}" ( {cast.length} attori )</h1>
            <Grid container spacing={7}>

                {cast.map((actor) =>
                    <Grid item key={actor.id} xs={12} sm={6} md={4}>
                        <ActorCard key={actor.id} actor={actor}/>
                    </Grid>

                )}
            </Grid>
        </div>
        )
}

export default CastPage;