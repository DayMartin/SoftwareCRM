import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, Typography, Modal, TablePagination } from '@mui/material';
import { Environment } from "../../../shared/environment";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { CategoriaService, ViewCategoria } from "../../../shared/services/api/Estoque/CategoriaService";
import AdicionarCategoria from "./AdicionarCategoria";
import { Busca } from "../../../shared/components/barra-inicial/Busca";

interface AdicionarCategoriasProps {
    open: boolean;
    onClose: () => void;
    title: string;
}

export const ListarCategorias: React.FC<AdicionarCategoriasProps> = ({
    open,
    onClose,
    title,
}) => {
    const [rows, setRows] = useState<ViewCategoria[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openCategoria, setOpenCategoria] = React.useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const handleOpenCategoria = () => setOpenCategoria(true);
    const handleCloseCategoria = () => setOpenCategoria(false);
    const titulo = "Categoria";
    
    const consultar = async () => {
        setIsLoading(true);
        try {
            const consulta = await CategoriaService.getAllList(page + 1, filterId);
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


    const handleSubmitCategoria = async (formData: any) => {
        try {
            await CategoriaService.createCategoria(formData);
            alert('Categoria criada com sucesso!');
            handleCloseCategoria();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar categoria');
        }
    };

    const handleExcluir = async (id: number) => {
        try {
            const result = await CategoriaService.deleteCategoriaById(id);

            if (result instanceof Error) {
                console.error(result.message);
                alert(result.message);
                return;
            }

            alert("Categoria excluída com sucesso!");

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
                    onClick={handleOpenCategoria}
                >
                    Nova Categoria
                </Button>


                <TableContainer component={Paper} sx={{ m: 1, width: 'auto' }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#F0F0F0" }}>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Nome</TableCell>
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
                                            {Environment.LISTAGEM_VAZIA}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map(row => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.nome}</TableCell>
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
                <AdicionarCategoria open={openCategoria} onClose={handleCloseCategoria} title="Nova categoria" onSubmit={handleSubmitCategoria} />

            </Box>
        </Modal>
    );
};
