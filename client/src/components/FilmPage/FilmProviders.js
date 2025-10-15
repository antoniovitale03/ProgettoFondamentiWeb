import {Box, Tooltip} from "@mui/material";
import * as React from "react";
import '../../CSS/FilmPage.css';

function FilmProviders({ rent, buy, flatrate }) {
    return(
        <Box>
        {rent &&
            <Box>
                <p className="text">Noleggia</p>
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
                <p className="text">Guarda in streaming</p>
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
                <p className="text">Acquista</p>
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