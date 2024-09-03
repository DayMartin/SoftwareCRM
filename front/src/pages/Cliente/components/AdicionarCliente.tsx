import React, { useState } from "react";
import { Box, Button, Modal, Typography, TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Grid } from "@mui/material";

interface AdicionarClienteProps {
    open: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (data: any) => void; 
}

const AdicionarCliente: React.FC<AdicionarClienteProps> = ({ open, onClose, title, onSubmit }) => {
    const [formData, setFormData] = useState({
        cpfcnpj: '',
        nome: '',
        telefone: '',
        endereco: '',
        email: '',
        status: 'ativo'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = () => {
        onSubmit(formData);
        resetForm();
        onClose();
    };

    const resetForm = () => {
        setFormData({
            cpfcnpj: '',
            nome: '',
            telefone: '',
            endereco: '',
            email: '',
            status: 'ativo'
        });
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    width: 600,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6" component="h2">
                    {title}
                </Typography>
                <Box component="form" sx={{ mt: 2 }}>
                    {/* Grid para Inputs */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="cpfcnpj"
                                label="CPF/CNPJ"
                                value={formData.cpfcnpj}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="nome"
                                label="Nome"
                                value={formData.nome}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="telefone"
                                label="Telefone"
                                value={formData.telefone}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="endereco"
                                label="Endereço"
                                value={formData.endereco}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                name="email"
                                label="Email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                    </Grid>

                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Salvar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AdicionarCliente;
