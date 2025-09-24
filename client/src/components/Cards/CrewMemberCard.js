import {Card, CardContent, CardMedia} from "@mui/material";

function CrewMemberCard({ crewMember }){
    return(
            <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                    <p>{crewMember.name}   ( {crewMember.department} )</p>
                    <CardMedia component="img" image={crewMember.profile_path} alt="Member crew image"/>
                </CardContent>
            </Card>
    )
}

export default CrewMemberCard;