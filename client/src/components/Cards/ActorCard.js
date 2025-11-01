import {Button, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {Link} from "react-router-dom"

export default function ActorCard ( {actor} ){
    return(
            <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                    <Typography component="p">
                        <Button component={Link} to={`/actor/${actor.name.replaceAll(" ", "-")}/${actor.id}`}>{actor.name}</Button>
                        ({actor.character})
                    </Typography>
                    <Button component={Link} to={`/actor/${actor.name.replaceAll(" ", "-")}/${actor.id}`}>
                        <CardMedia component="img" image={actor.profile_path} />
                    </Button>
                </CardContent>
            </Card>
    )
}