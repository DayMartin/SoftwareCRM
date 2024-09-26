import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, Typography, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentsIcon from '@mui/icons-material/Payments';

import { BarraAReceber } from "./BarraAReceber";
import { ParcelasService, IParcela, IParcelaCreate } from "../../../../shared/services/api/Vendas/ParcelasVendaService";
import { BarraInicial } from "../../../../shared/components/barra-inicial/BarraInicial";
import { Environment } from "../../../../shared/environment";

export const AReceber: React.VFC = () => {
    const [rows, setRows] = useState<IParcela[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [newDado, setNewDado] = useState('');
    const [newFilter, setNewFilter] = useState('');
    const titulo = "Contas a Receber";
    const hoje = new Date().toISOString().slice(0, 10);
    const objFilter = { Opcao1: 'pago', Opcao2: 'pendente', Opcao5: hoje || null};

    const consultar = async () => {
        setIsLoading(true);
        try {
            const consulta = await ParcelasService.getAllList(page + 1, filterId);
            if (consulta instanceof Error) {
                // alert(consulta.message);
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
                // alert('Dados retornados não são válidos');
                setTotalRecords(0);

            }
        } catch (error) {
            // alert('Erro ao consultar clientes');
            setRows([]);
        }
        setIsLoading(false);
    };

    const handleReceber = async (id: number, idvenda: number, valorPago: number) => {
        try {
            await ParcelasService.receberById(id, idvenda, valorPago);
            consultar();
        } catch (error) {
            alert('Erro ao receber');
        }
    };

    const handleDesfazerReceber = async (id: number, idvenda: number, valorPago: number) => {
        try {
            await ParcelasService.refazerReceberById(id, valorPago);
            consultar();
        } catch (error) {
            alert('Erro ao desfazer o receber');
        }
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
    };


      const handleFilterApply = async (filter: string, dado: string | null) => {
        setIsLoading(true);

        if(dado === null){
            setNewFilter('');
            setNewDado('');
            consultar(); 
        } else {
            try {
                const filtrar = await ParcelasService.filtro(page + 1, filter, dado);
                if (filtrar instanceof Error) {
                    // alert(filtrar.message);
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
                    // alert('Dados retornados não são válidos');
                    setTotalRecords(0);
    
                }
                setNewDado(dado);
                setNewFilter(filter);
            } catch (error) {
                // alert('Erro ao filtrarr clientes');
                setRows([]);
            }
        }
 
        setIsLoading(false);
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
            <BarraAReceber opcoes={objFilter} onFilterApply={handleFilterApply}/>

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto', marginLeft: '8%', marginRight: '2%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>parcela</TableCell>
                            <TableCell>valorParcela</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Vencimento</TableCell>
                            <TableCell>dataPago</TableCell>
                            <TableCell>venda_id</TableCell>
                            <TableCell>tipoPagamento</TableCell>
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
                                        <TableCell>{row.parcela}</TableCell>
                                        <TableCell>{row.valorParcela}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                        <TableCell>{row.dataPagamento}</TableCell>
                                        <TableCell>{row.dataPago}</TableCell>
                                        <TableCell>{row.venda_id}</TableCell>
                                        <TableCell>{row.tipoPagamento}</TableCell>

                                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                                            {row.status === "pendente" ? (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleReceber(row.id, row.venda_id, row.valorParcela)}
                                                    sx={{ height: "24px" }}
                                                >
                                                    <PaymentsIcon />

                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleDesfazerReceber(row.id, row.venda_id, row.valorParcela)}
                                                    sx={{ height: "24px" }}
                                                >
                                                    <DoNotDisturbOnIcon />
                                                </Button>
                                            )}
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
        </Box>
    );
};
