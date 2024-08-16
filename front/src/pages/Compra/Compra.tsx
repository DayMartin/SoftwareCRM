import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Menu, MenuItem, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableHead, TableRow, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { VendasService, IVenda, IVendaDetalhe } from "../../shared/services/api/Vendas/VendasService";
import { Environment } from "../../shared/environment";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { BarraInicial } from "../../shared/components/barra-inicial/BarraInicial";
import VendaDialog from "./components/VisualizarCompra";
import { BarraCompra } from "./components/BarraCompra";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import DehazeIcon from '@mui/icons-material/Dehaze';
import { CompraService, ICompra, ICompraDetalhe } from "../../shared/services/api/Compra/CompraService";
import CompraDialog from "./components/VisualizarCompra";


export const Compra: React.VFC = () => {
    const [rows, setRows] = useState<ICompraDetalhe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [selectedEstoque, setSelectedEstoque] = useState<ICompra | null>(null);
    const [selectedCompra, setSelectedCompra] = useState<ICompraDetalhe | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentRow, setCurrentRow] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState<string>('cliente');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);

    const titulo = "Compras";

    const consultar = async (tipo: string) => {
        setIsLoading(true);
        try {
            const consulta = await CompraService.getAllList(page + 1, filterId);
            if (consulta instanceof Error) {
                alert(consulta.message);
                setRows([]);
                setTotalRecords(0);

            } else if (Array.isArray(consulta)) {
                setRows(consulta);
                setTotalRecords(consulta.total);

            } else if (typeof consulta === 'object') {
                setRows(consulta.rows);
                setTotalRecords(consulta.total);

            } else {
                setRows([]);
                alert('Dados retornados não são válidos');
                setTotalRecords(0);

            }
        } catch (error) {
            alert('Erro ao consultar clientes');
            setRows([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        consultar(tipoUsuario);
    }, [tipoUsuario, page, filterId,]);

    const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); 
    };

    const handleFilterIdChange = (id: string) => {
        setFilterId(id);
        setPage(0); 
    };


    const handleClose = () => {
        setOpen(false);
        setSelectedEstoque(null);
        setIsEditing(false);
    };

    const handleVisualizar = (compra: ICompraDetalhe) => {
        setSelectedCompra(compra);
        setOpen(true);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
        setAnchorEl(event.currentTarget);
        setCurrentRow(row);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setCurrentRow(null);
    };
    const openMenu = Boolean(anchorEl);

    const cancelarCompra = async (id: number) => {
        try {
            await CompraService.deleteCompra(id)
        } catch (error) {
            alert('Erro ao cancelarCompra');
        }
    };


    // const handleSave = async (updatedClient: IListagemCliente) => {
    //     try {
    //         await UsersService.updateById(updatedClient.id, updatedClient);
    //         await consultar(tipoUsuario);
    //     } catch (error) {
    //         alert('Erro ao atualizar cliente');
    //     }
    // };


    return (
        <Box>
            <BarraInicial
                titulo={titulo}
                onFilterIdChange={handleFilterIdChange}
            />
            <BarraCompra />

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto', marginLeft: '8%', marginRight: '2%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Fornecedor</TableCell>
                            <TableCell>Funcionário</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Valor Total</TableCell>
                            <TableCell>Desconto</TableCell>
                            <TableCell>Valor Final</TableCell>
                            <TableCell>Valor Pago</TableCell>
                            <TableCell>Data de criação</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <LinearProgress variant='indeterminate' />
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        {Environment.LISTAGEM_VAZIA}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.fornecedor_id}</TableCell>
                                        <TableCell>{row.funcionario_id}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                        <TableCell>{row.valorTotal}</TableCell>
                                        <TableCell>{row.valorDesconto}</TableCell>
                                        <TableCell>{row.valorTotalDesconto}</TableCell>
                                        <TableCell>{row.valorPago}</TableCell>
                                        <TableCell>{row.data_criacao}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={(event) => handleClick(event, row)}
                                                sx={{ height: '24px' }}
                                            >
                                                <DehazeIcon />
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={openMenu && currentRow === row}
                                                onClose={handleCloseMenu}
                                            >
                                                <MenuItem onClick={() => { handleVisualizar(currentRow); handleCloseMenu(); }}>
                                                    <VisibilityIcon sx={{ mr: 1 }} /> Visualizar
                                                </MenuItem>
                                                <MenuItem onClick={() => { /* Aqui você pode adicionar a lógica para enviar email */ handleCloseMenu(); }}>
                                                    <EmailIcon sx={{ mr: 1 }} /> Enviar Email
                                                </MenuItem>
                                                <MenuItem onClick={() => { /* Aqui você pode adicionar a lógica para gerar PDF */ handleCloseMenu(); }}>
                                                    <PictureAsPdfIcon sx={{ mr: 1 }} /> Gerar PDF
                                                </MenuItem>
                                                {currentRow?.status !== 'cancelado' && (
                                                    <MenuItem onClick={() => { cancelarCompra(currentRow.id); handleCloseMenu(); }}>
                                                        <CancelIcon sx={{ mr: 1 }} /> Cancelar
                                                    </MenuItem>
                                                )}
                                            </Menu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        )}
                    </TableBody>
                </Table>
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
            <CompraDialog
                open={open}
                onClose={handleClose}
                compra={selectedCompra}
                isEditing={isEditing}
            />
        </Box>
    );
};
