import {Avatar, Button, Card, CardContent, Grid, IconButton, Tooltip, Typography} from "@mui/material";
import {Link} from "react-router-dom";
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReviewsIcon from "@mui/icons-material/Reviews";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BoltIcon from "@mui/icons-material/Bolt";


function UserCard({ user, showRemoveButton, onUnfollow }) {
    return(
        <Card sx={{ marginBottom: 10 }}>
            <CardContent>
                <Grid container spacing={2} >
                    <Grid size={2}>
                        <Button component={Link} to={`/${user.username}/profile`}>
                            <Avatar />
                        </Button>
                    </Grid>

                <Grid size={3}>
                    <Typography component="p">
                    <Typography component="a" href={`/${user.username}/profile`}>
                        {user.username}</Typography>
                    </Typography>
                    <Button component={Link} to={`/${user.username}/followers`} disabled={user.followers.length === 0}>
                        {user.followers.length} Followers
                    </Button>
                    <Button component={Link} to={`/${user.username}/following`} disabled={user.following.length === 0}>
                        {user.following.length} Following
                    </Button>
                </Grid>

                <Grid size={4}>
                    <Tooltip title={`Watchlist di ${user.username}`}>
                        <IconButton component={Link} to={`/${user.username}/watchlist`}>
                            <WatchLaterIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={`Film visti da ${user.username}`}>
                        <IconButton component={Link} to={`/${user.username}/watched`}>
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={`Recensioni di ${user.username}`}>
                        <IconButton component={Link} to={`/${user.username}/reviews`}>
                            <ReviewsIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={`Film preferiti di ${user.username}`}>
                        <IconButton component={Link} to={`/${user.username}/favorites`}>
                            <FavoriteIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={`Attività di ${user.username}`}>
                        <IconButton component={Link} to={`/${user.username}/activity`}>
                            <BoltIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>


                {
                    showRemoveButton &&
                    <Grid size={3}>
                        <Tooltip title={`Rimuovi ${user.username} dai seguiti`}>
                            <Button onClick={ () => onUnfollow(user._id, user.username) }>
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
