import {Card, CardContent, CardMedia, Typography} from "@mui/material";

function CrewMemberCard({ crewMember }){
    return(
            <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                    <Typography component="p">{crewMember.name}   ( {crewMember.department} )</Typography>
                    <CardMedia component="img" image={crewMember.profile_path} alt="Member crew image"/>
                </CardContent>
            </Card>
    )
}

export default CrewMemberCard;