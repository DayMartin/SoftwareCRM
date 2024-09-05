import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { IDetalheEstoque } from "../../../shared/services/api/Estoque/EstoqueService";

interface ProdutoEditViewDialogProps {
    open: boolean;
    onClose: () => void;
    prod: IDetalheEstoque | null;
    onSave?: (prod: IDetalheEstoque) => void;
    isEditing: boolean;
}

const ProdutoEditViewDialog: React.FC<ProdutoEditViewDialogProps> = ({ open, onClose, prod, onSave, isEditing }) => {
    const [editProd, setEditProd] = React.useState<IDetalheEstoque | null>(null);

    React.useEffect(() => {
        setEditProd(prod);
    }, [prod]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editProd) {
            setEditProd({
                ...editProd,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        if (editProd) {
            setEditProd({
                ...editProd,
                [name]: value,
            });
        }
    };

    const handleSave = () => {
        if (editProd && onSave) {
            onSave(editProd);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{isEditing ? "Editar Usuário" : "Detalhes do Usuário"}</DialogTitle>
            <DialogContent>
                {editProd ? (
                    <Grid container spacing={2}>
                        {/* Grid para os Inputs */}
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                id="id"
                                label="ID"
                                name="id"
                                value={editProd.id}
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
                                value={editProd.nome}
                                fullWidth
                                margin="normal"
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                id="valorUnitarioCompra"
                                label="Valor unitário Compra"
                                name="valorUnitarioCompra"
                                value={editProd.valorUnitarioCompra}
                                fullWidth
                                margin="normal"
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                id="valorUnitarioVenda"
                                label="Valor unitário Venda"
                                name="valorUnitarioVenda"
                                value={editProd.valorUnitarioVenda}
                                fullWidth
                                margin="normal"
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                id="fornecedor_id"
                                label="Fornecedor"
                                name="fornecedor_id"
                                value={editProd.fornecedor_id}
                                fullWidth
                                margin="normal"
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                required
                                id="categoria_id"
                                label="Categoria"
                                name="categoria_id"
                                value={editProd.categoria_id}
                                fullWidth
                                margin="normal"
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                id="marca_id"
                                label="Marca"
                                name="marca_id"
                                value={editProd.marca_id}
                                fullWidth
                                margin="normal"
                                disabled
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel id="promocao">Promoção</InputLabel>
                                <Select
                                    labelId="promocao"
                                    name="promocao"
                                    value={editProd.promocao}
                                    onChange={handleSelectChange}
                                    label="Promoção"
                                >
                                    <MenuItem value="ativo">Ativo</MenuItem>
                                    <MenuItem value="inativo">Inativo</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                id="valor_promocional"
                                label="Valor promocional"
                                name="valor_promocional"
                                value={editProd.valor_promocional}
                                fullWidth
                                margin="normal"
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="body1">Nenhum Produto selecionado.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                {isEditing && <Button onClick={handleSave} color="primary">Salvar</Button>}
                <Button onClick={onClose} color="primary">Fechar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProdutoEditViewDialog;
