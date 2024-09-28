import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "@mui/material";
import { useAuthContext } from "../../contexts/AuthContext";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

interface BarraInicialHomeProps {
  titulo: string;
}

export const BarraInicialHome: React.VFC<BarraInicialHomeProps> = ({
  titulo}) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debounceTimer, setDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);
  const { logout } = useAuthContext();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const handleLogout = () => {
    logout(); 
  };

  return (
    <Box
      sx={{
        m: 1,
        width: "auto",
        height: '80px',
        marginLeft: "6%",
        marginRight: "1%",
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
          <Grid item xs={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt="Logo"
                  src="https://gizmodo.uol.com.br/wp-content/blogs.dir/8/files/2023/07/robo-humanoide-chines.png"
                  sx={{ width: 50, height: 50 }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (setting === "Logout") {
                      handleLogout(); 
                    }
                  }}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};