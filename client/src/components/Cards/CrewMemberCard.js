import {Card, CardContent, CardMedia, Typography} from "@mui/material";

export default function CrewMemberCard({ crewMember }){
    return(
            <Card>
                <CardContent>
                    <Typography component="strong">{crewMember.name}   ( {crewMember.department} )</Typography>
                    <CardMedia component="img" image={crewMember.profile_path} />
                </CardContent>
            </Card>
    )
}