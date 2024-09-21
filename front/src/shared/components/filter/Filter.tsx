import * as React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface FilterProps {
  opcoes: { Opcao1: string, Opcao2: string, Opcao3: string };
  onApplyFilter: (filter: string, dado: string | null) => void; 
}

export const Filter: React.VFC<FilterProps> = ({
  opcoes,
  onApplyFilter 
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (option: string | null) => {
    onApplyFilter('status', option); 
    handleClose();
  };

  return (
    <div>
      <Button
        sx={{
          backgroundColor: '#0d47a1',
          color: 'white',
          borderRadius: '6%',
          width: 'auto',
          minWidth: 120,
          margin: '5px',
          height: 28,
          display: 'flex',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 'bold',
          alignItems: 'center',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            backgroundColor: '#0b3d91',
          },
        }}
        onClick={handleClick}
      >
        <FilterAltIcon />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleSelect(opcoes.Opcao1)}>Pago</MenuItem>
        <MenuItem onClick={() => handleSelect(opcoes.Opcao2)}>Pendente</MenuItem>
        <MenuItem onClick={() => handleSelect(opcoes.Opcao3)}>Cancelado</MenuItem>
        <MenuItem onClick={() => handleSelect(null)}>Remover Filtros</MenuItem>
      </Menu>
    </div>
  );
};
