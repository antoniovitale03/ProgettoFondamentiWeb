import {Button, Card, CardContent, CardMedia, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom"
import "../../CSS/FilmCard.css";

export default function ActorCard ( {actor} ){
    const navigate = useNavigate();
    return(
            <Card>
                <CardContent>
                    <Typography component="p">
                        <Button component={Link} to={`/actor/${actor.name.replaceAll(" ", "-")}/${actor.id}`}>{actor.name}</Button>
                        ({actor.character})
                    </Typography>
                    <CardMedia className="card_media" component="img" image={actor.profile_path} onClick={ () => navigate(`/actor/${actor.name.replaceAll(" ", "-")}/${actor.id}`) } />
                </CardContent>
            </Card>
    )
}