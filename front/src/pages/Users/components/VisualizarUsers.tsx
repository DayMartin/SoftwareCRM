import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Grid, FormControl, Select, SelectChangeEvent, InputLabel, MenuItem } from "@mui/material";
import { IListagemUser } from "../../../shared/services/api/Users/UsersService";

interface UsersDialogProps {
    open: boolean;
    onClose: () => void;
    client: IListagemUser | null;
    onSave?: (client: IListagemUser) => void;
    isEditing: boolean;
}

const UsersDialog: React.FC<UsersDialogProps> = ({ open, onClose, client, onSave, isEditing }) => {
    const [editClient, setEditClient] = React.useState<IListagemUser | null>(null);


    React.useEffect(() => {
        setEditClient(client || {
            id: '',
            tipo: '',
            cpfcnpj: '',
            nome: '',
            telefone: '',
            endereco: '',
            email: '',
            status: '',
            data_criacao: '',
            senha: '',
            porcentoComissao: 0
        });
    }, [client]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editClient) {
            setEditClient({
                ...editClient,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        if (editClient) {
            setEditClient({
                ...editClient,
                tipo: event.target.value,
            });
        }
    };

    const handleSave = () => {
        if (editClient && onSave) {
            onSave(editClient);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{isEditing ? "Editar Usuário" : "Detalhes do Usuário"}</DialogTitle>
            <DialogContent>
                {editClient ? (
                    <Grid container spacing={2}>
                        {/* Grid para os Inputs */}

                        <Grid item xs={12} sm={4}>
                            {/* Grid para os Inputs */}
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="tipo-label">Tipo</InputLabel>
                                <Select
                                    labelId="tipo-label"
                                    name="tipo"
                                    value={editClient.tipo}
                                    onChange={handleSelectChange}
                                    displayEmpty
                                    disabled={!isEditing}
                                >
                                    <MenuItem value="adm">Administrador</MenuItem>
                                    <MenuItem value="vendedor">Vendedor</MenuItem>
                                    <MenuItem value="estoquista">Estoquista</MenuItem>
                                    <MenuItem value="financeiro">Financeiro</MenuItem>

                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                id="id"
                                label="ID"
                                name="id"
                                value={editClient.id}
                                fullWidth
                                margin="normal"
                                disabled
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                id="nome"
                                label="Nome"
                                name="nome"
                                value={editClient.nome}
                                fullWidth
                                margin="normal"
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                id="cpfcnpj"
                                label="CPF/CNPJ"
                                name="cpfcnpj"
                                value={editClient.cpfcnpj}
                                fullWidth
                                margin="normal"
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                id="telefone"
                                label="Telefone"
                                name="telefone"
                                value={editClient.telefone}
                                fullWidth
                                margin="normal"
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                id="status"
                                label="Status"
                                name="status"
                                value={editClient.status}
                                fullWidth
                                margin="normal"
                                disabled
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="endereco"
                                label="Endereço"
                                name="endereco"
                                value={editClient.endereco}
                                fullWidth
                                margin="normal"
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="porcentoComissao"
                                label="Porcentagem comissão"
                                value={editClient.porcentoComissao}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                id="email"
                                label="Email"
                                name="email"
                                value={editClient.email}
                                fullWidth
                                margin="normal"
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="senha"
                                label="Senha"
                                name="senha"
                                type="password"
                                value={editClient.senha || ""}
                                fullWidth
                                margin="normal"
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="body1">Nenhum Users selecionado.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                {isEditing && <Button onClick={handleSave} color="primary">Salvar</Button>}
                <Button onClick={onClose} color="primary">Fechar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UsersDialog;
