import { Box, Button } from "@mui/material";
import { CompraService } from "../../../shared/services/api/Compra/CompraService";
import * as React from "react";
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AdicionarUsers from "../../Users/components/AdicionarUsers";
import AdicionarCompra from "./AdicionarCompra";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

interface BarraCompraProps {
    listar: () => void
}

export const BarraCompra: React.FC<BarraCompraProps> = ({
    listar
}) => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [alertVisible, setAlertVisible] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (formData: any) => {
        try {
            await CompraService.create(formData);
            setAlertVisible(true);
            listar()
            setTimeout(() => {
                setAlertVisible(false);
              }, 3000);
            handleClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar Compra');
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
            {alertVisible && (
                <Stack
                    sx={{
                        width: '100%',
                        position: 'absolute', 
                        top: 16, 
                        left: 0,
                        zIndex: 1300,
                    }}
                    spacing={2}
                >
                    <Alert severity="success">Compra realizada com sucesso!</Alert>
                </Stack>
            )}
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
                onClick={handleOpen}
            >
                Nova compra
            </Button>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 'auto',
                }}
            >

                {/* <Button
                    sx={{
                        backgroundColor: '#0d47a1',
                        color: 'white',
                        borderRadius: '6%',
                        width: 'auto',
                        minWidth: 120,
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
                    onClick={() => navigate('/pagar')}                >
                    A Pagar
                </Button> */}
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
                    onClick={() => navigate('/pagar')}                >
                    Solicitação de compra
                </Button>
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
                    onClick={() => navigate('/pagar')}                >
                    <LocalPrintshopIcon />
                </Button>

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
                    onClick={() => navigate('/pagar')}                >
                    <FilterAltIcon />
                </Button>
            </Box>


            {/* Modal para adicionar nova compra */}
            <AdicionarCompra open={open} onClose={handleClose} title="Nova compra" onSubmit={handleSubmit} />
        </Box>
    );
};
