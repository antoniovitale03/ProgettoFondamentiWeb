import CrewMemberCard from './CrewMemberCard'
import {useLocation, useParams} from "react-router-dom";
import useDocumentTitle from "./useDocumentTitle";
function CrewPage(){
    const { filmTitle } = useParams()

    useDocumentTitle(`Crew di "${filmTitle}"`);

    const location = useLocation();
    const crew = location.state?.crew;
    return(
        <div>
            <h1>Crew di "{filmTitle}" ({crew.length} membri)</h1>
            {crew.map( (crewMember) => <CrewMemberCard key={crewMember.id} crewMember={crewMember} /> )}
        </div>

    )
}

export default CrewPage;