import React, { useState, useEffect } from 'react';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    TablePagination, Paper, Button, LinearProgress, Box, Avatar 
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { HistoricoModal } from './components/ListarHistorico';
import { ItemProdutoModal } from './components/ListarItemProduto';
import ProdutoEditViewDialog from './components/VisualizarEditarProduto';
import { EditProducao, EstoqueService, IDetalheEstoque } from '../../shared/services/api/Estoque/EstoqueService';
import { BarraInicial } from '../../shared/components/barra-inicial/BarraInicial';
import { BarraEstoque } from './components/BarraEstoque';
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
    const [filterName, setFilterName] = useState('');
    const [imageUrls, setImageUrls] = useState<{ [key: number]: string }>({});
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isEditing, setIsEditing] = useState(false);

    const consultar = async () => {
        setIsLoading(true);
        try {
            const consulta = await EstoqueService.getAllList(page + 1, filterName);
            if (consulta instanceof Error) {
                setRows([]);
                setTotalRecords(0);
            } else if (Array.isArray(consulta)) {
                setRows(consulta);
                generateImageUrls(consulta);
                setTotalRecords(consulta.total);
            } else if (typeof consulta === 'object') {
                setRows(consulta.rows);
                generateImageUrls(consulta.rows);
                setTotalRecords(consulta.total);
            } else {
                setRows([]);
                setTotalRecords(0);
            }
        } catch (error) {
            setRows([]);
        }
        setIsLoading(false);
    };

    const generateImageUrls = (items: IDetalheEstoque[]) => {
        items.forEach(item => {
            if (item.imagem) {
                if (item.imagem instanceof Blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImageUrls(prev => ({ ...prev, [item.id]: reader.result as string }));
                    };
                    reader.readAsDataURL(item.imagem);
                } else if (item.imagem.type && item.imagem.data) {
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

    useEffect(() => {
        consultar();
    }, [page, filterName]);

    const handleVisualizarHistoric = (id: number) => {
        setSelectedEstoque(id);
        setOpen(true);
    };

    const handleVisualizar = (prod: IDetalheEstoque) => {
        setSelectedProd(prod);
        setOpenEditView(true);
        setIsEditing(false);
    };

    const handleExcluir = async (id: number) => {
        try {
            const result = await EstoqueService.deleteEstoqueById(id);
            if (result instanceof Error) {
                alert(result.message);
                return;
            }
            consultar();
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

    const titulo = "Estoque";
    const handleClose = () => setOpen(false);
    const handleCloseItemEstoque = () => setOpenItemProduto(false);

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
    };
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
                onFilterIdChange={setFilterName}
            />
            <BarraEstoque listar={consultar} />
            <TableContainer component={Paper} sx={{ m: 1, width: 'auto', marginLeft: '8%', marginRight: '2%', maxHeight: 500, overflowY: 'auto' }}>
                {isLoading ? (
                    <LinearProgress variant="indeterminate" />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Imagem</TableCell>
                                <TableCell>Cod</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Valor de Compra</TableCell>
                                <TableCell>Valor de Venda</TableCell>
                                <TableCell>Promoção</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((item: IDetalheEstoque) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Avatar
                                            src={imageUrls[item.id] || '/static/images/cards/contemplative-reptile.jpg'}
                                            alt={item.nome}
                                            sx={{ width: 56, height: 56 }}
                                        />
                                    </TableCell>
                                    <TableCell>{item.id}</TableCell>
                                    <TableCell>{item.nome}</TableCell>
                                    <TableCell>{item.quantidade || '0'}</TableCell>
                                    <TableCell>{item.valorUnitarioCompra || '0'}</TableCell>
                                    <TableCell>{item.valorUnitarioVenda || '0'}</TableCell>
                                    <TableCell>{item.promocao || '0'}</TableCell>
                                    <TableCell>
                                        <Button startIcon={<VisibilityIcon />} onClick={() => handleVisualizar(item)} />
                                        <Button startIcon={<AccessTimeFilledIcon />} onClick={() => handleVisualizarHistoric(item.id)} />
                                        <Button startIcon={<EditIcon />} onClick={() => handleEditar(item)} />
                                        <Button startIcon={<DeleteIcon />} color="error" onClick={() => handleExcluir(item.id)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
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
                    isEditing={isEditing}
                    onClose={handleCloseProd}
                    onSave={handleSave}
                
                />
            )}
        </Box>
    );
};

export default Estoque;
