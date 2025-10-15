import {Box, Tooltip} from "@mui/material";
import * as React from "react";
import '../../CSS/FilmPage.css';

function FilmProviders({ film }) {
    return(
        <Box>
        {film?.rent ?
            <Box>
                <p className="text">Noleggia</p>
                <Box className="box">
                    { film.rent.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img className="img" src={film.logo_path}/>
                        </Tooltip>
                    )
                    }
                </Box>
            </Box>
            : null
        }

        { film?.flatrate ?
            <Box>
                <p className="text">Guarda in streaming</p>
                <Box className="box">
                    { film.flatrate.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img className="img" src={film.logo_path} />
                        </Tooltip>
                    )
                    }
                </Box>
            </Box> : null
        }

        { film?.buy ?
            <Box>
                <p className="text">Acquista</p>
                <Box className="box">
                    { film.buy.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img className="img" src={film.logo_path}/>
                        </Tooltip>
                    )
                    }
                </Box>
            </Box> : null
        }
        </Box>
    )
}

export default FilmProviders;