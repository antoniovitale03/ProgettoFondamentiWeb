import {Box, Stack} from "@mui/material";

function CrewMemberCard({ crewMember }){
    return(
        <Box>
            <Stack spacing={4}>
                <p>{crewMember.name}   ( {crewMember.department} )</p>
                <img src={crewMember.profile_path} alt="Member crew image"/>
            </Stack>
        </Box>
    )
}

export default CrewMemberCard;