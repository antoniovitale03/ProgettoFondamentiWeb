import {Box, Button, Card, CardContent, CardMedia} from "@mui/material";
import {Link} from "react-router-dom"

function ActorCard ( {actor} ){
    return(
        <Box>
            <Card>
                <CardContent>
                    <p>
                        <Button component={Link} to={`/actor/${actor.name.replaceAll(" ", "-")}/${actor.id}`}>{actor.name}</Button>
                        ({actor.character})
                    </p>
                    <CardMedia component="img" image={actor.profile_path} alt="Actor image"/>
                </CardContent>
            </Card>
        </Box>
    )
}

export default ActorCard;