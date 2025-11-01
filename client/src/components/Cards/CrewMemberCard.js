import {Card, CardContent, CardMedia, Typography} from "@mui/material";

export default function CrewMemberCard({ crewMember }){
    return(
            <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                    <Typography component="strong">{crewMember.name}   ( {crewMember.department} )</Typography>
                    <CardMedia component="img" image={crewMember.profile_path} />
                </CardContent>
            </Card>
    )
}