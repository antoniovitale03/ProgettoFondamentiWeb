import {Avatar, Box, Button, Card, CardContent, Grid, Tooltip, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReviewsIcon from "@mui/icons-material/Reviews";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CloseIcon from "@mui/icons-material/Close";

import * as React from "react";
function UserCard({ user, showRemoveButton, onRemove }) {
    return(
        <Card sx={{ marginBottom: 10 }}>
            <CardContent>
                <Grid container spacing={2} >
                    <Grid size={2}>
                        <Button component={Link} to={`/${user.username}/profile`}>
                            <Avatar src={`http://localhost:5001/${user.avatar_path}`} />
                        </Button>
                    </Grid>

                <Grid size={3}>
                    <p>
                    <Typography component="a" href={`/${user.username}/profile`}>
                        {user.username}</Typography>
                    </p>
                        <Button component={Link} to={`/${user.username}/followers`} disabled={user.followers.length === 0}>
                            {user.followers.length} Followers
                        </Button>
                        <Button component={Link} to={`/${user.username}/followers`} disabled={user.following.length === 0}>
                            {user.following.length} Following
                        </Button>
                </Grid>

                <Grid size={4}>
                    <Tooltip title={`Watchlist di ${user.username}`}>
                        <Button component={Link} to={`/${user.username}/watchlist`}>
                            <WatchLaterIcon />
                        </Button>
                    </Tooltip>

                    <Tooltip title={`Film visti da ${user.username}`}>
                        <Button component={Link} to={`/${user.username}/watched`}>
                            <VisibilityIcon />
                        </Button>
                    </Tooltip>

                    <Tooltip title={`Recensioni di ${user.username}`}>
                        <Button component={Link} to={`/${user.username}/reviews`}>
                            <ReviewsIcon />
                        </Button>
                    </Tooltip>

                    <Tooltip title={`Film preferiti di ${user.username}`}>
                        <Button component={Link} to={`/${user.username}/favorites`}>
                            <ThumbUpIcon />
                        </Button>
                    </Tooltip>

                </Grid>


                {
                    showRemoveButton &&
                    <Grid size={3}>
                        <Tooltip title={`Rimuovi ${user.username} dai seguiti`}>
                            <Button onClick={ () => onRemove(user._id, user.username) }>
                                <CloseIcon />
                            </Button>
                        </Tooltip>
                    </Grid>
                }
                </Grid>

            </CardContent>
        </Card>
    )
}

export default UserCard;
