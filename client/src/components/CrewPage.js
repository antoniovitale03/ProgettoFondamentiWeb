import CrewMemberCard from './Cards/CrewMemberCard'
import {useLocation, useParams} from "react-router-dom";
import useDocumentTitle from "./useDocumentTitle";
import {Grid} from "@mui/material";
import ActorCard from "./Cards/ActorCard";
function CrewPage(){
    const { filmTitle } = useParams()

    useDocumentTitle(`Crew di "${filmTitle}"`);

    const location = useLocation();
    const crew = location.state?.crew;
    return(
        <div>
            <h1>Crew di "{filmTitle}" ({crew.length} membri)</h1>
            <Grid container spacing={7}>

                {crew.map((crewMember) =>
                    <Grid item key={crewMember.id} xs={12} sm={6} md={4}>
                        <CrewMemberCard key={crewMember.id} crewMember={crewMember} />
                    </Grid>
                )}
            </Grid>
        </div>

    )
}

export default CrewPage;