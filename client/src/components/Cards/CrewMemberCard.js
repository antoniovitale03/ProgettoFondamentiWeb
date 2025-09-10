import {Box, Card, CardContent, CardMedia} from "@mui/material";

function CrewMemberCard({ crewMember }){
    return(
        <Box>
            <Card>
                <CardContent>
                    <p>{crewMember.name}   ( {crewMember.department} )</p>
                    <CardMedia component="img" image={crewMember.profile_path} alt="Member crew image"/>
                </CardContent>
            </Card>
        </Box>
    )
}

export default CrewMemberCard;