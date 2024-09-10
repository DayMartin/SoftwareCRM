import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Button, Typography, LinearProgress, Box, TableContainer, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { HistoricoModal } from './components/ListarHistorico';
import { ItemProdutoModal } from './components/ListarItemProduto';
import ProdutoEditViewDialog from './components/VisualizarEditarProduto';
import { EditProducao, EstoqueService, IDetalheEstoque } from '../../shared/services/api/Estoque/EstoqueService';
import { BarraInicial } from '../../shared/components/barra-inicial/BarraInicial';
import { BarraEstoque } from './components/BarraEstoque';
import { ThreeDRotationSharp } from '@mui/icons-material';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const Estoque: React.FC = () => {
    const [rows, setRows] = useState<IDetalheEstoque[]>([]);
    const [selectedEstoque, setSelectedEstoque] = useState<number | null>(null);
    const [selectedItemEstoque, setSelectedItemEstoque] = useState<number | null>(null);
    const [selectedProd, setSelectedProd] = useState<IDetalheEstoque | null>(null);
    const [open, setOpen] = useState(false);
    const [openItemProduto, setOpenItemProduto] = useState(false);
    const [openEditView, setOpenEditView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [filterId, setFilterId] = useState<number | null>(null);
    const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({}); // Armazena URLs de imagens
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isEditing, setIsEditing] = useState(false);



    const consultar = async () => {
        setIsLoading(true);
        try {
            const consulta = await EstoqueService.getAllList();
            if (consulta instanceof Error) {
                setRows([]);
            } else if (Array.isArray(consulta)) {
                setRows(consulta);
                // handle array data
                generateImageUrls(consulta); // Gera URLs para imagens
            } else if (typeof consulta === 'object') {
                setRows(consulta.rows);
                generateImageUrls(consulta.rows); // Gera URLs para imagens
            } else {
                setRows([]);
            }
        } catch (error) {
            setRows([]);
        }
        setIsLoading(false);
    };

    const generateImageUrls = (items: IDetalheEstoque[]) => {
        items.forEach(item => {
            if (item.imagem) {
                // Verifica se `item.imagem` é um Blob
                if (item.imagem instanceof Blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImageUrls(prev => ({ ...prev, [item.id]: reader.result as string }));
                    };
                    reader.readAsDataURL(item.imagem);
                } else if (item.imagem.type && item.imagem.data) {
                    // Se `item.imagem` é um objeto com `type` e `data`, converte para Blob
                    const byteArray = new Uint8Array(item.imagem.data);
                    const blob = new Blob([byteArray], { type: item.imagem.type });
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImageUrls(prev => ({ ...prev, [item.id]: reader.result as string }));
                    };
                    reader.readAsDataURL(blob);
                }
            }
        });
    };

    const handleFilterIdChange = (id: string) => {
        // setFilterId(id);
        setPage(0);
    };

    useEffect(() => {
        consultar();
    }, [page, filterId]);

    const handleVisualizar = (id: number) => {
        setSelectedEstoque(id);
        setOpen(true);
    };

    const handleExcluir = async (id: number) => {
        try {
            const result = await EstoqueService.deleteEstoqueById(id);

            if (result instanceof Error) {
                console.error(result.message);
                alert(result.message);
                return;
            }

            alert("Estoque excluído com sucesso!");

        } catch (error) {
            console.error("Erro inesperado:", error);
        }
    };


    const handleEditar = (prod: IDetalheEstoque) => {
        setSelectedProd(prod);
        setOpenEditView(true);
        setIsEditing(true);
    };

    const handleCloseProd = () => {
        setOpenEditView(false);
        setSelectedProd(null);
        setIsEditing(false);
    };

    const handleSave = async (updatedProd: EditProducao) => {
        try {
            await EstoqueService.updateById(updatedProd.id, updatedProd);
            await consultar();
            handleCloseProd();
        } catch (error) {
            alert('Erro ao atualizar Produto');
        }
    };


    const listar = async () => {
        try {
            await consultar();
        } catch (error) {
            console.error("Erro ao listar:", error)
        }
    }
    const titulo = "Estoque";
    const handleClose = () => setOpen(false);
    const handleCloseItemEstoque = () => setOpenItemProduto(false);

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'Saída':
                return { color: 'red' };
            case 'Entrada':
                return { color: 'green' };
            case 'Defeito':
                return { color: 'orange' };
            default:
                return { fontWeight: 'bold' };
        }
    };

    return (
        <Box>
            <BarraInicial
                titulo={titulo}
                onFilterIdChange={handleFilterIdChange}
            />
            <BarraEstoque listar={listar} />
            <TableContainer component={Paper} sx={{ m: 1, width: 'auto', marginLeft: '8%', marginRight: '2%' }}>
                {isLoading ? (
                    <LinearProgress variant="indeterminate" />
                ) : (
                    <Grid container spacing={2}>
                        {rows.map((item: IDetalheEstoque) => (
                            <Grid item xs={6} sm={4} md={2.1} key={item.id}>
                                <Card sx={{ maxWidth: 200, minWidth: 200 }}>
                                    <CardMedia
                                        sx={{ height: 100 }} // Ajusta a altura da imagem para ser menor
                                        image={imageUrls[item.id] || '/static/images/cards/contemplative-reptile.jpg'}
                                        title={item.nome}
                                    />
                                    <CardContent sx={{ padding: 1 }}>
                                        <Typography gutterBottom variant="body2" component="div" noWrap>
                                            {item.nome}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                            Quantidade: {item.quantidade || '0'}
                                            <br />
                                            Valor compra: {item.valorUnitarioCompra || '0'}
                                            <br />
                                            Valor venda: {item.valorUnitarioVenda || '0'}
                                            <br />
                                            Promoção: {item.promocao || '0'}
                                        </Typography>

                                    </CardContent>
                                    <CardActions sx={{ padding: 2, margin: 0, display: 'flex', flexDirection: 'row', gap: 0.5 }}>
                                        <Button
                                            sx={{ padding: 0.5, minWidth: 'auto', width: 30, height: 24 }}
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => handleVisualizar(item.id)}
                                        />
                                        <Button
                                            sx={{ padding: 0.5, minWidth: 'auto', width: 30, height: 24 }}
                                            size="small"
                                            startIcon={<AccessTimeFilledIcon />}
                                            onClick={() => handleVisualizar(item.id)}
                                        />
                                        <Button
                                            sx={{ padding: 0.5, minWidth: 'auto', width: 30, height: 24 }}
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEditar(item)}
                                        />
                                        <Button
                                            sx={{ padding: 0.5, minWidth: 'auto', width: 30, height: 24 }}
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleExcluir(item.id)}
                                        />
                                    </CardActions>

                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </TableContainer>

            {selectedEstoque && (
                <HistoricoModal
                    open={open}
                    idHistoric={selectedEstoque}
                    onClose={handleClose}
                    getTipoColor={getTipoColor}
                />
            )}
            {selectedItemEstoque && (
                <ItemProdutoModal
                    open={openItemProduto}
                    idHistoric={selectedItemEstoque}
                    onClose={handleCloseItemEstoque}
                    getTipoColor={getTipoColor}
                />
            )}
            {selectedProd && (
                <ProdutoEditViewDialog
                    open={openEditView}
                    prod={selectedProd}
                    isEditing={true}
                    onClose={handleCloseProd}
                    onSave={handleSave}
                />
            )}
        </Box>
    );
};

export default Estoque;
