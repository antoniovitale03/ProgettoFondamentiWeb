import {Avatar, Box, Button, Card, CardContent, Grid, Tooltip} from "@mui/material";
import {Link} from "react-router-dom";
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReviewsIcon from "@mui/icons-material/Reviews";
import * as React from "react";
function UserCard({ user, showRemoveButton, onRemove }) {
    return(
        <Card sx={{ marginBottom: 10 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'row' }}>
                <Grid container spacing={2}>
                    <Grid size={2}>
                        <Button component={Link} to={`/${user.username}/profile`}>
                            <Avatar src={`http://localhost:5001/${user.avatar_path}`} />
                        </Button>

                    </Grid>
                </Grid>

                <Grid size={2}>
                    <p>{user.username}</p>
                    <p>
                        <a href={`/${user.username}/followers`}>{user.followers.length} Followers </a> - <a href={`/${user.username}/following`}>{user.following.length} Following </a>
                    </p>
                </Grid>

                <Grid size={1}>
                    <Tooltip title={`Watchlist di ${user.username}`}>
                        <Button component={Link} to={`/${user.username}/watchlist`}>
                            <WatchLaterIcon />
                        </Button>
                    </Tooltip>
                </Grid>

                <Grid size={1}>
                    <Tooltip title={`Film visti da ${user.username}`}>
                        <Button component={Link} to={`/${user.username}/watched`}>
                            <VisibilityIcon />
                        </Button>
                    </Tooltip>
                </Grid>

                <Grid size={1}>
                    <Tooltip title={`Recensioni di ${user.username}`}>
                        <Button component={Link} to={`/${user.username}/reviews`}>
                            <ReviewsIcon />
                        </Button>
                    </Tooltip>
                </Grid>
                {
                    showRemoveButton &&
                    <Grid size={2}>
                        <Tooltip title={`Rimuovi ${user.username} dai seguiti`}>
                            <Button onClick={ () => onRemove(user._id) } >
                                ciao
                            </Button>
                        </Tooltip>
                    </Grid>
                }

            </CardContent>
        </Card>
    )
}

export default UserCard;
