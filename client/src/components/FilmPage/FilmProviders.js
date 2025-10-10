import {Box, Tooltip} from "@mui/material";
import * as React from "react";

function FilmProviders({ rent, flatrate, buy }) {
    return(
        <Box>
        {rent &&
            <Box>
                <h2>Noleggia</h2>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 1 }}>
                    { rent.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img src={film.logo_path} style={{ width: '100%' }} />
                        </Tooltip>
                    )
                    }
                </Box>
            </Box>
        }

        { flatrate &&
            <Box>
                <h2>Guarda in streaming</h2>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 1 }}>
                    { flatrate.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img src={film.logo_path} />
                        </Tooltip>
                    )
                    }
                </Box>
            </Box>
        }

        { buy &&
            <Box>
                <h2>Acquista</h2>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 1 }}>
                    { buy.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img src={film.logo_path} style={{ width: '100%' }} />
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