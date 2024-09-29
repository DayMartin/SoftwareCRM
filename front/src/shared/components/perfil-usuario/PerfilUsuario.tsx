import * as React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Grid,
} from "@mui/material";
import { IDetalheUsers, UsersService } from "../../services";

interface BarraPerfilUsuarioProps {
    idUser: number;
    open: boolean;
    onClose: () => void;
}

const PerfilUsuario: React.FC<BarraPerfilUsuarioProps> = ({ open, onClose, idUser }) => {
    const [editClient, setEditClient] = React.useState<IDetalheUsers | null>(null);
    const isEditing = true;

    const consultaFuncionario = async () => {
        try {
            const dados = await UsersService.getByID(idUser);
            if (dados instanceof Error) {
                setEditClient(null);
            } else {
                setEditClient(dados);
                console.log('dados', dados)
            }
        } catch (error) {
            console.error("Error", error);
        }
    };

    React.useEffect(() => {
        if (open) {
            consultaFuncionario(); // Chama a função somente se o modal estiver aberto
        } else {
            setEditClient(null); // Limpa os dados quando o modal é fechado
        }
    }, [open, idUser]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (editClient) {
            setEditClient({
                ...editClient,
                [name]: value,
            });
        }
    };

    const handleSave = async () => {
        if (editClient) {
            await onSave(editClient);
            onClose();
        }
    };

    const onSave = async (updatedClient: IDetalheUsers) => {
        try {
            await UsersService.updateById(updatedClient.id, updatedClient);
            await consultaFuncionario();
        } catch (error) {
            alert("Erro ao atualizar cliente");
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{isEditing ? "Editar Funcionário" : "Detalhes do Funcionário"}</DialogTitle>
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

export default PerfilUsuario;
