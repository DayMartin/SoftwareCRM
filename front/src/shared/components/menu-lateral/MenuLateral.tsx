import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";
import HomeIcon from "@mui/icons-material/Home";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;
const expandedDrawerWidth = 220; // Largura do drawer quando aberto

const openedMixin = (theme: Theme): CSSObject => ({
  width: expandedDrawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${expandedDrawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MenuLateral() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [openFinanceiro, setOpenFinanceiro] = React.useState(false);
  const [openComercial, setOpenComercial] = React.useState(false);
  const [openEstoque, setOpenEstoque] = React.useState(false);


  const handleListItemClick = (text: string) => {
    if (text === "Contas") {
      navigate("/user");
    } else if (text === "Estoque") {
      setOpenEstoque(!openEstoque);
    } else if (text === "Comercial") {
      setOpenComercial(!openComercial);
    } else if (text === "Financeiro") {
      setOpenFinanceiro(!openFinanceiro);
    } else if (text === "Home") {
      navigate("/");
    }
  };

  const handleSubItemClickFinanceiro = (text: string) => {
    if (text === "Contas a pagar") {
      navigate("/pagar");
    } else if (text === "Contas a receber") {
      navigate("/receber");
    }
  };

  const handleSubItemClickComercial = (text: string) => {
    if (text === "Vendas") {
      navigate("/venda");
    } else if (text === "Compras") {
      navigate("/compra");
    }
  };

  const handleSubItemClickEstoque = (text: string) => {
    if (text === "Estoque") {
      navigate("/estoque");
    } else if (text === "Categoria") {
      navigate("/categoria");
    } else if (text === "Marca") {
      navigate("/marca");
    } else if (text === "CentroTroca") {
      navigate("/centroTroca");
    }
  };

  const handleMouseLeave = () => {
    setOpen(false);
    setOpenFinanceiro(false);
    setOpenComercial(false);
    setOpenEstoque(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        open={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={handleMouseLeave}
      >
        <DrawerHeader />
        <Divider />
        <List sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {["Contas", "Comercial", "Financeiro", "Estoque"].map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{
                display: "block",
                flexGrow: 1,
              }}
            >
              <ListItemButton
                selected={location.pathname.includes(text.toLowerCase())}
                onClick={() => handleListItemClick(text)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
                  {index === 0 ? (
                    <PeopleOutlineIcon />
                  ) : index === 1 ? (
                    <PointOfSaleIcon />
                  ) : index === 2 ? (
                    <MonetizationOnIcon />
                  ) : (
                    <InventoryIcon />
                  )}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>

              {text === "Financeiro" && (
                <Collapse in={openFinanceiro} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: open ? 8 : 5 }} onClick={() => handleSubItemClickFinanceiro("Contas a pagar")}>
                      <ListItemText primary="Contas a pagar" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: open ? 8 : 5 }} onClick={() => handleSubItemClickFinanceiro("Contas a receber")}>
                      <ListItemText primary="Contas a receber" />
                    </ListItemButton>
                  </List>
                </Collapse>
              )}

              {text === "Comercial" && (
                <Collapse in={openComercial} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: open ? 8 : 5 }} onClick={() => handleSubItemClickComercial("Vendas")}>
                      <ListItemText primary="Vendas" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: open ? 8 : 5 }} onClick={() => handleSubItemClickComercial("Compras")}>
                      <ListItemText primary="Compras" />
                    </ListItemButton>
                  </List>
                </Collapse>
              )}

              {text === "Estoque" && (
                <Collapse in={openEstoque} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: open ? 8 : 5 }} onClick={() => handleSubItemClickEstoque("Estoque")}>
                      <ListItemText primary="Estoque" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: open ? 8 : 5 }} onClick={() => handleSubItemClickEstoque("Categoria")}>
                      <ListItemText primary="Categoria" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: open ? 8 : 5 }} onClick={() => handleSubItemClickEstoque("Marca")}>
                      <ListItemText primary="Marca" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: open ? 8 : 5 }} onClick={() => handleSubItemClickEstoque("CentroTroca")}>
                      <ListItemText primary="CentroTroca" />
                    </ListItemButton>
                  </List>
                </Collapse>
              )}
            </ListItem>
          ))}
        </List>
        <Divider />
        <List sx={{ display: "flex", flexGrow: 1 }}>
          <ListItem disablePadding sx={{ flexGrow: 1 }}>
            <ListItemButton
              selected={location.pathname === "/"}
              onClick={() => handleListItemClick("Home")}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center" }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Conteúdo principal aqui */}
      </Box>
    </Box>
  );
}
