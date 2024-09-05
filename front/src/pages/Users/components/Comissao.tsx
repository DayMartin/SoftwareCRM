import React, { useEffect, useState } from "react";
import { Box, Modal, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, LinearProgress, TextField, Grid } from "@mui/material";
import { IVendaDetalhe, VendasService } from "../../../shared/services/api/Vendas/VendasService";
import { Busca } from "../../../shared/components/barra-inicial/Busca";
import { IListagemUser } from "../../../shared/services";

interface ComissaoProps {
    open: boolean;
    onClose: () => void;
    funcionario_id: number | null;
    title: string
}

const Comissao: React.FC<ComissaoProps> = ({ open, onClose, funcionario_id, title }) => {
    const [rows, setRows] = useState<IVendaDetalhe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterId, setFilterId] = useState('0');
    const [totalRecords, setTotalRecords] = useState(0);
    const [dataInicio, setDataInicio] = useState<string>('');
    const [dataFim, setDataFim] = useState<string>('');
    const [comissao, setComissao] = useState(0);

    const consultar = async (funcionario_id: number) => {
        setIsLoading(true);
        try {
            // Formatar as datas para o formato aceito pela API
            const dataInicioFormatada = dataInicio || '';
            const dataFimFormatada = dataFim || '';
            const limit = 5;
            const consulta = await VendasService.getComissaoVendedor(page + 1, limit, funcionario_id, dataInicioFormatada, dataFimFormatada);

            if (consulta instanceof Error) {
                setRows([]);
                setTotalRecords(0);
            } else {
                setRows(consulta.vendas);
                setTotalRecords(consulta.total);
                setComissao(consulta.totalComissao)
            }
        } catch (error) {
            setRows([]);
            setTotalRecords(0);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (funcionario_id) {
            consultar(funcionario_id);
        }
    }, [funcionario_id, page, filterId, dataInicio, dataFim]);

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

                <Typography
                    sx={{
                        fontSize: 18,
                        mb: 2,
                    }}
                    color="#0d47a1"
                    gutterBottom
                >
                    {title}
                </Typography>

                    <Grid item xs={12} sm={6}>
                        <Typography
                            sx={{
                                fontSize: 18,
                                mb: 2,
                                paddingBottom: 6
                            }}
                            color="#0d47a1"
                        >
                            Valor total a receber: R$ {comissao}
                        </Typography>
                    </Grid>
                {/* Seletor de Data */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <TextField
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        size="small"
                        sx={{ width: "45%", mx: 1 }}
                        InputLabelProps={{ shrink: true }}
                        label="Data Início"
                    />
                    <TextField
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        size="small"
                        sx={{ width: "45%", mx: 1 }}
                        InputLabelProps={{ shrink: true }}
                        label="Data Fim"
                    />
                </Box>

                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Venda</TableCell>
                                <TableCell>Vendedor</TableCell>
                                <TableCell>Valor Desconto</TableCell>
                                <TableCell>Valor Final</TableCell>
                                <TableCell>Data da venda</TableCell>
                                <TableCell>Comissão R$</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.funcionario_id}</TableCell>
                                    <TableCell>{row.valorDesconto}</TableCell>
                                    <TableCell>{row.valorTotalDesconto}</TableCell>
                                    <TableCell>{row.data_criacao}</TableCell>
                                    <TableCell>R$ {row.comissao}</TableCell>

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

export default Comissao;
