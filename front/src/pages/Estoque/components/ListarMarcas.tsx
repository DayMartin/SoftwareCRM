import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, Typography, Modal, TablePagination } from '@mui/material';
import { Environment } from "../../../shared/environment";
import { MarcaService, ViewMarca } from "../../../shared/services/api/Estoque/MarcaService";
import AdicionarMarca from "./AdicionarMarca";
import DeleteIcon from '@mui/icons-material/Delete';
import { Busca } from "../../../shared/components/barra-inicial/Busca";

interface AdicionarMarcasProps {
    open: boolean;
    onClose: () => void;
    title: string;
}


export const ListarMarcas: React.FC<AdicionarMarcasProps> = ({
    open,
    onClose,
    title,
}) => {
    const [rows, setRows] = useState<ViewMarca[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openMarca, setOpenMarca] = React.useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const handleOpenMarca = () => setOpenMarca(true);
    const handleCloseMarca = () => setOpenMarca(false);
    const titulo = "Marca";

    const consultar = async () => {
        setIsLoading(true);
        try {
            const consulta = await MarcaService.getAllList(page + 1, filterId);
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

    const handleSubmitMarca = async (formData: any) => {
        try {
            await MarcaService.createMarca(formData);
            alert('Marca criada com sucesso!');
            handleCloseMarca();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar Marca');
        }
    };

    const handleExcluir = async (id: number) => {
        try {
            const result = await MarcaService.deleteMarcaById(id);

            if (result instanceof Error) {
                console.error(result.message);
                alert(result.message);
                return;
            }

            alert("Marca excluída com sucesso!");

        } catch (error) {
            console.error("Erro inesperado:", error);
        }
    };


    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    bgcolor: "background.paper",
                    p: 4,
                    borderRadius: 2,
                    boxShadow: 24,
                    width: "100%",
                    maxWidth: "40%",
                }}
            >
                <Busca
                    titulo={titulo}
                    onFilterIdChange={handleFilterIdChange}
                />
                <Typography variant="h6" component="h2" gutterBottom>
                    {title}
                </Typography>
                <Button
                    sx={{
                        backgroundColor: '#0d47a1',
                        color: 'white',
                        borderRadius: '6%',
                        width: 'auto',
                        minWidth: 120,
                        height: 28,
                        display: 'flex',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 'bold',
                        alignItems: 'center',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                            backgroundColor: '#0b3d91',
                        },
                        mr: 1,
                    }}
                    onClick={handleOpenMarca}
                >
                    Nova Marca
                </Button>


                <TableContainer component={Paper} sx={{ m: 1, width: 'auto' }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#F0F0F0" }}>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Categoria</TableCell>
                                <TableCell>Ações</TableCell>

                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <LinearProgress variant='indeterminate' />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={2}>
                                            {Environment.LISTAGEM_VAZIA}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map(row => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.nome}</TableCell>
                                            <TableCell>{row.categoria_id}</TableCell>

                                            {/* <TableCell>
                                                <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleEditar(row)}
                                                sx={{ mr: 1, height:'24px' }}
                                            >
                                                <EditIcon />
                                            </Button>
                                            </TableCell> */}
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleExcluir(row.id)}
                                                    sx={{ mr: 1, height: '24px' }}
                                                >
                                                    <DeleteIcon />
                                                </Button>
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
                <AdicionarMarca open={openMarca} onClose={handleCloseMarca} title="Nova Marca" onSubmit={handleSubmitMarca} />

            </Box>
        </Modal>
    );
};
