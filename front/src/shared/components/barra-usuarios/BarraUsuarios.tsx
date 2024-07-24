import { Box, Button } from "@mui/material";
import { UsersService } from "../../../shared/services/api/Users/UsersService";
import * as React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AdicionarUsers from "../../../pages/Users/components/AdicionarUsers";

interface BarraUsuariosProps {
    onTipoChange: (tipo: string) => void;
}

export const BarraUsuarios: React.VFC<BarraUsuariosProps> = ({ onTipoChange }) => {
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (formData: any) => {
        try {
            await UsersService.create(formData);
            alert('Usuário criado com sucesso!');
            handleClose();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar usuário');
        }
    };

    return (
        <Box
            sx={{
                m: 1,
                width: "auto",
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
                    left: '16px',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#0d47a1',
                    color: 'white',
                    borderRadius: '50%',
                    width: 56,
                    height: 56,
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
                <AddIcon />
            </Button>

            {/* Botões de ação */}
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item>
                        <Card
                            sx={{
                                maxWidth: 120,
                                minWidth: 120, 
                                backgroundColor: "#F0F8FF",
                                borderRadius: 6,
                                cursor: "pointer",
                            }}
                            onClick={() => onTipoChange('cliente')} 
                        >
                            <CardContent>
                                <Typography
                                    sx={{ fontSize: 16, textAlign: "center", margin: 'auto' }}
                                    color="text.secondary"
                                >
                                    Cliente
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card
                            sx={{
                                maxWidth: 120,
                                backgroundColor: "#F5F5DC",
                                borderRadius: 6,
                                cursor: "pointer",
                            }}
                            onClick={() => onTipoChange('fornecedor')}
                        >
                            <CardContent>
                                <Typography
                                    sx={{ fontSize: 16, textAlign: "center", margin: 'auto' }}
                                    color="text.secondary"
                                >
                                    Fornecedor
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card
                            sx={{
                                maxWidth: 120,
                                backgroundColor: "#FFDAB9",
                                borderRadius: 6,
                                cursor: "pointer",
                            }}
                            onClick={() => onTipoChange('funcionario')}
                        >
                            <CardContent>
                                <Typography
                                    sx={{ fontSize: 16, textAlign: "center", margin: 'auto' }}
                                    color="text.secondary"
                                >
                                    Funcionário
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Modal para adicionar usuários */}
            <AdicionarUsers open={open} onClose={handleClose} title="Adicionar Novo Usuário" onSubmit={handleSubmit} />
        </Box>
    );
};
