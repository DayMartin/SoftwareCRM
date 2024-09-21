import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Menu, MenuItem, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableHead, TableRow, Dialog } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CancelIcon from '@mui/icons-material/Cancel';
import EmailIcon from '@mui/icons-material/Email';
import DehazeIcon from '@mui/icons-material/Dehaze';

import { Environment } from "../../shared/environment";
import { BarraVenda } from "./components/BarraVenda";
import { BarraInicial } from "../../shared/components/barra-inicial/BarraInicial";
import { generatePDF } from "../../shared/components/pdf/pdfVendas";
import { VendasService, IVenda, IVendaDetalhe } from "../../shared/services/api/Vendas/VendasService";
import VendaDialog from "./components/VisualizarVenda";

export const Venda: React.VFC = () => {
    const [rows, setRows] = useState<IVendaDetalhe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedEstoque, setSelectedEstoque] = useState<IVenda | null>(null);
    const [selectedVenda, setSelectedVenda] = useState<IVendaDetalhe | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentRow, setCurrentRow] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [newDado, setNewDado] = useState('');
    const [newFilter, setNewFilter] = useState('');

    const [openPDF, setOpenPDF] = useState(false);
    const [idVenda, setIDVenda] = useState(0);

    const objFilter = { Opcao1: 'pago', Opcao2: 'pendente', Opcao3: 'cancelado', Opcao4: 'parcial' || null };
    const titulo = "Vendas";

    const consultar = async () => {
        setIsLoading(true);
        try {
            const consulta = await VendasService.getAllList(page + 1, filterId);
            if (consulta instanceof Error) {
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
                setTotalRecords(0);
            }
        } catch (error) {
            setRows([]);
        }
        setIsLoading(false);
    };

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
        consultar(); 
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEstoque(null);
        setIsEditing(false);
        consultar();
    };

    const handleVisualizar = (venda: IVendaDetalhe) => {
        setSelectedVenda(venda);
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

    const cancelarVenda = async (id: number) => {
        try {
            await VendasService.deleteVenda(id);
            consultar(); 
        } catch (error) {
            alert('Erro ao cancelar venda');
        }
    };

    const handleFilterApply = async (filter: string, dado: string | null) => {
        setIsLoading(true);
        if (dado === null) {
            setNewFilter('');
            setNewDado('');
            consultar(); 
        } else {
            try {
                const filtrar = await VendasService.filtro(page + 1, filter, dado);
                if (filtrar instanceof Error) {
                    setRows([]);
                    setTotalRecords(0);
                } else if (Array.isArray(filtrar)) {
                    setRows(filtrar);
                    setTotalRecords(filtrar.total);
                } else if (typeof filtrar === 'object') {
                    setRows(filtrar.rows);
                    setTotalRecords(filtrar.total);
                } else {
                    setRows([]);
                    setTotalRecords(0);
                }
                setNewDado(dado);
                setNewFilter(filter);
            } catch (error) {
                setRows([]);
            }
        }
        setIsLoading(false);
    };

    const handleOpenPDF = (id: number) => {
        generatePDF(id);
    };

    useEffect(() => {
        consultar(); 
    }, []);

    useEffect(() => {
        if (newFilter && newDado) {
            handleFilterApply(newFilter, newDado);
        } else {
            consultar(); 
        }
    }, [page, newFilter, newDado]);

    useEffect(() => {
        if (filterId) {
            consultar(); 
        }
    }, [filterId]);

    return (
        <Box>
            <BarraInicial
                titulo={titulo}
                onFilterIdChange={handleFilterIdChange}
            />
            <BarraVenda listar={consultar} opcoes={objFilter} onFilterApply={handleFilterApply} />

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto', marginLeft: '8%', marginRight: '2%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Cliente</TableCell>
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
                                        <TableCell>{row.cliente_id}</TableCell>
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
                                                <MenuItem onClick={() => { handleCloseMenu(); }}>
                                                    <EmailIcon sx={{ mr: 1 }} /> Enviar Email
                                                </MenuItem>
                                                <MenuItem onClick={() => { handleOpenPDF(currentRow?.id); handleCloseMenu(); }}>
                                                    <PictureAsPdfIcon sx={{ mr: 1 }} /> Gerar PDF
                                                </MenuItem>
                                                {currentRow?.status !== 'cancelado' && (
                                                    <MenuItem onClick={() => { cancelarVenda(currentRow.id); handleCloseMenu(); }}>
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
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <VendaDialog
                open={open}
                onClose={handleClose}
                venda={selectedVenda}
                isEditing={isEditing}
            />        </Box>
    );
};
