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
        <Card sx={{backgroundColor:"#a4c3b2ff", margin:"30px",alignItems:"center", justifyContent:"center"}}>
            <CardContent>
                <Grid container spacing={2}  >
                    <Grid size={2}>
                        <Button component={Link} to={`/${user.username}/profile`}>
                            <Avatar sx={{display:"flex", justifyContent:"center"}} />
                        </Button>
                    </Grid>

                <Grid size={3}>
                    <Typography component="p">
                    <Link className="link_card" to={`/${user.username}/profile`}>
                        {user.username}</Link>
                    </Typography>
                    <Button sx={{color:"#344e41"}} component={Link} to={`/${user.username}/followers`} disabled={user.followers.length === 0}>
                        {user.followers.length} Followers
                    </Button>
                    <Button  sx={{color:"#344e41"}} component={Link} to={`/${user.username}/following`} disabled={user.following.length === 0}>
                        {user.following.length} Following
                    </Button>
                </Grid>

                <Grid size={7} sx={{display:"flex",justifyContent:"space-between"}}>
                    <Tooltip title={`Watchlist di ${user.username}`}>
                        <IconButton component={Link} to={`/${user.username}/watchlist`}>
                            <WatchLaterIcon sx={{color:"#344e41"}}/>
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={`Film visti da ${user.username}`}>
                        <IconButton component={Link} to={`/${user.username}/watched`}>
                            <VisibilityIcon sx={{color:"#344e41"}} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={`Recensioni di ${user.username}`}>
                        <IconButton component={Link} to={`/${user.username}/reviews`}>
                            <ReviewsIcon sx={{color:"#344e41"}} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={`Film preferiti di ${user.username}`}>
                        <IconButton component={Link} to={`/${user.username}/favorites`}>
                            <FavoriteIcon sx={{color:"#344e41"}} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={`Attività di ${user.username}`}>
                        <IconButton component={Link} to={`/${user.username}/activity`}>
                            <BoltIcon sx={{color:"#344e41"}} />
                        </IconButton>
                    </Tooltip>

                    {
                        showRemoveButton &&
                        <Tooltip title={`Rimuovi ${user.username} dai seguiti`}>
                            <Button onClick={ () => onUnfollow(user._id, user.username) }>
                                <CloseIcon sx={{color:"#344e41"}} />
                            </Button>
                        </Tooltip>
                    }
                </Grid>
                </Grid>

            </CardContent>
        </Card>
    )
}

export default UserCard;
