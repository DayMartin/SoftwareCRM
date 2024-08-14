import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "@mui/material";

interface BuscaProps {
  titulo: string;
  onFilterIdChange: (id: string) => void;
}

export const Busca: React.VFC<BuscaProps> = ({
  titulo,
  onFilterIdChange,
}) => {

  const [searchTerm, setSearchTerm] = React.useState('');
  const [debounceTimer, setDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      const [id] = newValue.split(' ');
      onFilterIdChange(id);
    }, 700); 

    setDebounceTimer(timer);
  };

  return (
    <Box
      sx={{
        m: 1,
        width: "auto",
        height: '90px',
        marginLeft: "8%",
        marginRight: "2%",
        padding: '2%',
        backgroundColor: 'white',
        borderRadius: '8px'
      }}
    >
      <Grid container spacing={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography
              sx={{
                fontSize: 18,
                marginLeft: 0,
                marginTop: 2,
              }}
              color="#0d47a1"
              gutterBottom
            >
              {titulo}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              placeholder="Filtrar por ID "
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <SearchIcon />
                ),
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
