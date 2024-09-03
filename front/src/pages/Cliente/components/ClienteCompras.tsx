import React, { useEffect, useState } from "react";
import { Box, Button, Modal, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, LinearProgress } from "@mui/material";
import { IVendaDetalhe, VendasService } from "../../../shared/services/api/Vendas/VendasService";
import { Busca } from "../../../shared/components/barra-inicial/Busca";

interface ClienteComprasProps {
    open: boolean;
    onClose: () => void;
    clienteId: number | null;
    title: string;
}

const ClienteCompras: React.FC<ClienteComprasProps> = ({ open, onClose, clienteId, title }) => {
    const [rows, setRows] = useState<IVendaDetalhe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);

    const consultar = async (cliente_id: number) => {
        setIsLoading(true);
        try {
            const consulta = await VendasService.getAllListCliente(page + 1, filterId, cliente_id);

            if (consulta instanceof Error) {
                setRows([]);
                setTotalRecords(0);
            } else {
                setRows(consulta.rows);
                setTotalRecords(consulta.total);
            }
        } catch (error) {
            setRows([]);
            setTotalRecords(0);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (clienteId) {
            consultar(clienteId);
        }
    }, [clienteId, page, filterId]);

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
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    width: '80%',
                    maxWidth: 1000,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                    textAlign: 'center',
                }}
            >
                <Busca
                    titulo={title}
                    onFilterIdChange={handleFilterIdChange}
                />
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Compra</TableCell>
                                <TableCell>Vendedor</TableCell>
                                <TableCell>Parcelas</TableCell>
                                <TableCell>Valor Total</TableCell>
                                <TableCell>Valor Desconto</TableCell>
                                <TableCell>Valor Final</TableCell>
                                <TableCell>Valor Pago</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Data da compra</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.funcionario_id}</TableCell>
                                    <TableCell>{row.QTparcelas}</TableCell>
                                    <TableCell>{row.valorTotal}</TableCell>
                                    <TableCell>{row.valorDesconto}</TableCell>
                                    <TableCell>{row.valorTotalDesconto}</TableCell>
                                    <TableCell>{row.valorPago}</TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell>{row.data_criacao}</TableCell>
                                </TableRow>
                            ))}
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
                {isLoading && <LinearProgress />}
            </Box>
        </Modal>
    );
};

export default ClienteCompras;
