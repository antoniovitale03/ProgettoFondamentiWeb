import {Box, Button, Stack} from "@mui/material";
import {Link} from "react-router-dom"

function ActorCard ( {actor} ){
    return(
        <Box>
            <Stack spacing={4}>
                <p> <Button component={Link} to={`/actor/${actor.name.replaceAll(" ", "-")}/${actor.id}`}>{actor.name}</Button>
                    ({actor.character})</p>
                <img src={actor.profile_path} alt="Actor image"/>
                <p>-------------</p>
            </Stack>
        </Box>
    )
}

export default ActorCard;