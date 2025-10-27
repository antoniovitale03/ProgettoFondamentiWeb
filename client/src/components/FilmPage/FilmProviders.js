import {Box, Tooltip, Typography} from "@mui/material";
import * as React from "react";
import '../../CSS/FilmProviders.css';

function FilmProviders({ rent, buy, flatrate }) {
    return(
        <Box>
        {rent &&
            <Box className="box_providers">
                <Typography  component="p" className="text">Noleggia</Typography>
                { rent.map( film =>
                        <Tooltip title={film.provider_name}>
                                <img className="img" src={film.logo_path} alt=""/>
                        </Tooltip>
                )
                }
            </Box>
        }

        { flatrate &&

            <Box className="box_providers">
                <Typography component="p" className="text">Guarda in streaming</Typography>
                { flatrate.map( film =>
                    <Tooltip title={film.provider_name}>
                            <img className="img" src={film.logo_path} alt=""/>
                    </Tooltip>
                )
                }
            </Box>
        }

        { buy &&
            <Box className="box_providers">
                <Typography component="p" className="text">Acquista</Typography>
                    { buy.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img className="img" src={film.logo_path} alt=""/>
                        </Tooltip>
                    )
                    }
            </Box>
        }
        </Box>
    )
}

export default FilmProviders;