import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Grid } from "@mui/material";
import { IListagemCliente } from "../../../shared/services/api/Users/UsersService";

interface ClienteDialogProps {
    open: boolean;
    onClose: () => void;
    client: IListagemCliente | null;
    onSave?: (client: IListagemCliente) => void;
    isEditing: boolean; 
}

const ClienteDialog: React.FC<ClienteDialogProps> = ({ open, onClose, client, onSave, isEditing }) => {
    const [editClient, setEditClient] = React.useState<IListagemCliente | null>(null);

    React.useEffect(() => {
        setEditClient(client);
    }, [client]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editClient) {
            setEditClient({
                ...editClient,
                [e.target.name]: e.target.value,
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
            <DialogTitle>{isEditing ? "Editar Cliente" : "Detalhes do Cliente"}</DialogTitle>
            <DialogContent>
                {editClient ? (
                    <Grid container spacing={2}>
                        {/* Grid para os Inputs */}
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
                        <Grid item xs={12} sm={8}>
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
                        <Grid item xs={12} sm={4}>
                            <TextField
                                id="data_criacao"
                                label="Data criação"
                                name="data_criacao"
                                value={editClient.data_criacao}
                                fullWidth
                                margin="normal"
                                disabled
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="body1">Nenhum cliente selecionado.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                {isEditing && <Button onClick={handleSave} color="primary">Salvar</Button>}
                <Button onClick={onClose} color="primary">Fechar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClienteDialog;
