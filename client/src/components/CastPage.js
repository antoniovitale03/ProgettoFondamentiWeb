import {useLocation, useParams} from "react-router-dom";
import ActorCard from "./ActorCard"
import useDocumentTitle from "./useDocumentTitle";
// /films/filmTitle/filmID/cast
function CastPage(){
    const {filmTitle} = useParams()

    const location = useLocation();
    const cast = location.state?.cast;

    useDocumentTitle(`Cast di "${filmTitle}"`);
    return(
        <div>
            <h1>Cast di "{filmTitle}" ( {cast.length} attori )</h1>
            {cast.map( (actor) => <ActorCard key={actor.id} actor={actor} />)}
        </div>
        )
}

export default CastPage;