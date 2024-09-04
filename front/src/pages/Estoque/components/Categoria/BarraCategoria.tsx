import { Box, Button } from "@mui/material";
import * as React from "react";
import { useNavigate } from 'react-router-dom';

import { CategoriaService } from "../../../../shared/services/api/Estoque/CategoriaService";
import AdicionarCategoria from "./AdicionarCategoria";

import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface BarraCategoriaProps {
    listar: () => void;
  }


export const BarraCategoria: React.FC<BarraCategoriaProps> = ({
    listar
}) => {
    const navigate = useNavigate();
    const [openCategoria, setOpenCategoria] = React.useState(false);


    const handleOpenCategoria = () => setOpenCategoria(true);
    const handleCloseCategoria = () => setOpenCategoria(false);

    const titulo = "Categoria";

    const handleSubmitCategoria = async (formData: any) => {
        try {
            await CategoriaService.createCategoria(formData);
            alert('Categoria criada com sucesso!');
            listar();
            handleCloseCategoria();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar categoria');
        }
    };


    return (
        <Box
            sx={{
                m: 1,
                width: "auto",
                height: '30px',
                marginLeft: "8%",
                marginRight: "2%",
                padding: '2%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                borderRadius: '8px'
            }}
        >
            <Button
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '28px',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#0d47a1',
                    color: 'white',
                    borderRadius: '6%',
                    width: '10%',
                    minWidth: '10%',
                    height: 28,
                    fontSize: 10,
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                        backgroundColor: '#0b3d91',
                    },
                }}
                onClick={handleOpenCategoria}
            >
                Nova categoria
            </Button>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 'auto',
                }}
            >

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
                    onClick={() => navigate('/receber')}                >
                    <FilterAltIcon />
                </Button>
            </Box>
            <AdicionarCategoria open={openCategoria} onClose={handleCloseCategoria} title="Nova categoria" onSubmit={handleSubmitCategoria} />

        </Box>
    );
};
