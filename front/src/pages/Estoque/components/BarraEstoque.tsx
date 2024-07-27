import { Box, Button } from "@mui/material";
import * as React from "react";
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AdicionarEstoque from "./AdicionarEstoque";
import { EstoqueService } from "../../../shared/services/api/Estoque/EstoqueService";

export const BarraEstoque: React.VFC = () => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (formData: any) => {
        try {
            await EstoqueService.create(formData);
            alert('Produto criado com sucesso!');
            handleClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar Venda');
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
                    borderRadius: '100%',
                    width: 28,
                    minWidth: 28,
                    height: 28,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                        backgroundColor: '#0b3d91',
                    },
                }}
                onClick={handleOpen}
            >
                <AddIcon/>
            </Button>

            {/* Modal para adicionar nova venda */}
            <AdicionarEstoque open={open} onClose={handleClose} title="Novo produto" onSubmit={handleSubmit} />
        </Box>
    );
};
