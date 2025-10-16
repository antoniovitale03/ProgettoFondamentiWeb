import {Box, Tooltip, Typography} from "@mui/material";
import '../../CSS/FilmPage.css';

function FilmProviders({ rent, buy, flatrate }) {
    return(
        <Box>
        {rent &&
            <Box>
                <Typography component="p" className="text">Noleggia</Typography>
                <Box className="box">
                    { rent.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img className="img" src={film.logo_path} alt=""/>
                        </Tooltip>
                    )
                    }
                </Box>
            </Box>
        }

        { flatrate &&
            <Box>
                <Typography  component="p" className="text">Guarda in streaming</Typography>
                <Box className="box">
                    { flatrate.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img className="img" src={film.logo_path} alt=""/>
                        </Tooltip>
                    )
                    }
                </Box>
            </Box>
        }

        { buy &&
            <Box>
                <Typography  component="p" className="text">Acquista</Typography>
                <Box className="box">
                    { buy.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img className="img" src={film.logo_path} alt=""/>
                        </Tooltip>
                    )
                    }
                </Box>
            </Box>
        }
        </Box>
    )
}

export default FilmProviders;