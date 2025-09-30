import {Box, Tooltip} from "@mui/material";
import * as React from "react";

function FilmProviders({ film }) {
    return(
        <Box>
        {film && film.rent &&
            <Box>
                <h2>Noleggia</h2>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 1 }}>
                    { film.rent.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img src={film.logo_path} style={{ width: '100%' }} />
                        </Tooltip>
                    )
                    }
                </Box>
            </Box>
        }

        { film && film.flatrate &&
            <Box>
                <h2>Guarda in streaming</h2>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 1 }}>
                    { film.flatrate.map( film =>
                        <Tooltip title={film.provider_name}>
                            <img src={film.logo_path} />
                        </Tooltip>
                    )
                    }
                </Box>
            </Box>
        }

        { film && film.buy &&
            <Box>
                <h2>Acquista</h2>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', gap: 1 }}>
                    { film.buy.map( film =>
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