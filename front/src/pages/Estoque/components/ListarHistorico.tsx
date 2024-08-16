import * as React from "react";
import { Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableHead, TableRow, Typography, TablePagination, Button } from '@mui/material';
import { EstoqueService, IDetalheHistoric } from "../../../shared/services/api/Estoque/EstoqueService";
import { useState, useEffect } from 'react';

interface HistoricoModalProps {
    open: boolean;
    onClose: () => void;
    idHistoric: number;
    getTipoColor: (tipo: string) => object;
}

export const HistoricoModal: React.VFC<HistoricoModalProps> = ({
    open,
    onClose,
    idHistoric,
    getTipoColor
}) => {

    const [rowsHistoric, setRowsHistoric] = useState<IDetalheHistoric[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);

    const consulta = async (id: number) => {
        try {
            const historico = await EstoqueService.getByHistoricList(page + 1, filterId, id);
            if (historico instanceof Error) {
                alert(historico.message);
                setRowsHistoric([]);
                setTotalRecords(0);
            } else if (historico && typeof historico === 'object' && Array.isArray(historico.rows)) {
                setRowsHistoric(historico.rows);
                setTotalRecords(historico.total);
            } else {
                setRowsHistoric([]);
                alert('Dados retornados não são válidos');
                setTotalRecords(0);
            }
        } catch (error) {
            alert('Erro ao consultar histórico');
            setRowsHistoric([]);
            setTotalRecords(0);
        }
    }

    useEffect(() => {
        consulta(idHistoric);
    }, [page, filterId]);

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
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Histórico do Estoque</DialogTitle>
            <DialogContent>
                <Table>
                    <TableHead sx={{ backgroundColor: "#F0F0F0" }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Compra</TableCell>
                            <TableCell>Venda</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Estoque</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Data</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rowsHistoric.length > 0 ? (
                            rowsHistoric.map(historico => (
                                <TableRow key={historico.id}>
                                    <TableCell>{historico.id}</TableCell>
                                    <TableCell>{historico.compra_id || 'Não se aplica'}</TableCell>
                                    <TableCell>{historico.venda_id || 'Não se aplica'}</TableCell>
                                    <TableCell>{historico.quantidade}</TableCell>
                                    <TableCell>{historico.estoque_id}</TableCell>
                                    <TableCell>
                                        <Typography sx={getTipoColor(historico.tipo)}>
                                            {historico.tipo}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{historico.data_criacao}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    Nenhum histórico encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </DialogContent>
            <TablePagination
                rowsPerPageOptions={[5]}
                component="div"
                count={totalRecords}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            <Button onClick={onClose} color="primary">
                Fechar
            </Button>
        </Dialog>
    );
};
