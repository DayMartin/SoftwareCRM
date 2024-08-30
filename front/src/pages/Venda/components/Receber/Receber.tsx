import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, Typography, TablePagination } from '@mui/material';
import { Environment } from "../../../../shared/environment";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { BarraInicial } from "../../../../shared/components/barra-inicial/BarraInicial";
import { BarraAReceber } from "./BarraAReceber";
import { ParcelasService, IParcela, IParcelaCreate } from "../../../../shared/services/api/Vendas/ParcelasVendaService";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentsIcon from '@mui/icons-material/Payments';

export const AReceber: React.VFC = () => {
    const [rows, setRows] = useState<IParcela[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [tipoUsuario, setTipoUsuario] = useState<string>('cliente');
    const titulo = "Contas a Receber";

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

    useEffect(() => {
        consultar();
    }, [page, filterId]);

    const handleReceber = async (id: number, idvenda: number, valorPago: number) => {
        try {
            await ParcelasService.receberById(id, idvenda, valorPago);
        } catch (error) {
            alert('Erro ao receber');
        }
    };

    const handleDesfazerReceber = async (id: number, idvenda: number, valorPago: number) => {
        try {
            await ParcelasService.refazerReceberById(id, valorPago);

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


    return (
        <Box>
            <BarraInicial
                titulo={titulo}
                onFilterIdChange={handleFilterIdChange}
            />
            <BarraAReceber />

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto', marginLeft: '8%', marginRight: '2%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>parcela</TableCell>
                            <TableCell>valorParcela</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>dataPagamento</TableCell>
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
