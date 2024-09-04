import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IDetalheCentroTroca, ICentroTroca, CentroTrocaService } from "../../shared/services/api/CentroTroca/CentroTrocaService";
import AdicionarCentroTroca from "./components/AdicionarCentroTroca";
import { Busca } from "../../shared/components/barra-inicial/Busca";
import { BarraCentroTroca } from "./components/BarraCentroTroca";

export const ListarCentroTroca: React.FC = () => {
    const [rows, setRows] = useState<IDetalheCentroTroca[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openCentroTroca, setOpenCentroTroca] = React.useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);

    const handleOpenCentroTroca = () => setOpenCentroTroca(true);
    const handleCloseCentroTroca = () => setOpenCentroTroca(false);
    const titulo = "CentroTroca";

    const consultar = async () => {
        setIsLoading(true);
        try {
            const consulta = await CentroTrocaService.getAllList(page + 1, filterId);
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

    useEffect(() => {
        consultar();
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

    const handleSubmitCentroTroca = async (formData: any) => {
        try {
            await CentroTrocaService.create(formData);
            alert('CentroTroca criada com sucesso!');
            handleCloseCentroTroca();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar CentroTroca');
        }
    };

    // const handleExcluir = async (id: number) => {
    //     try {
    //         const result = await CentroTrocaService.deleteCentroTrocaById(id);

    //         if (result instanceof Error) {
    //             console.error(result.message);
    //             alert(result.message);
    //             return;
    //         }

    //         alert("CentroTroca excluída com sucesso!");

    //     } catch (error) {
    //         console.error("Erro inesperado:", error);
    //     }
    // };

    const listar = async() => {
        try {
            await consultar();
        } catch (error) {
            console.error("Erro ao listar,", error)
        }
    }

    return (
        <Box
        >
            <Busca
                titulo={titulo}
                onFilterIdChange={handleFilterIdChange}
            />
            <BarraCentroTroca listar={listar}/>

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto', marginLeft: '8%', marginRight: '2%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Venda</TableCell>
                            <TableCell>Produto</TableCell>
                            <TableCell>item Antigo</TableCell>
                            <TableCell>item Novo</TableCell>
                            <TableCell>motivo</TableCell>
                            <TableCell>Solicitado troca ao fornecedor</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={1}>
                                    <LinearProgress variant='indeterminate' />
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={1}>
                                        Nenhuma CentroTroca encontrada.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.descricaoTroca}</TableCell>
                                        <TableCell>{row.venda_id}</TableCell>
                                        <TableCell>{row.estoque_id}</TableCell>
                                        <TableCell>{row.item_antigo_codBarra}</TableCell>
                                        <TableCell>{row.item_novo_codBarra}</TableCell>
                                        <TableCell>{row.motivo}</TableCell>
                                        <TableCell>{row.send_fornecedor ? "Sim" : "Não"}</TableCell>

                                        {/* <TableCell>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleExcluir(row.id)}
                                                sx={{ mr: 1, height: '24px' }}
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        </TableCell> */}
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
            <AdicionarCentroTroca open={openCentroTroca} onClose={handleCloseCentroTroca} title="Nova Troca" onSubmit={handleSubmitCentroTroca} />
        </Box>
    );
};
