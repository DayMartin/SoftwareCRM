import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, Typography, Modal } from '@mui/material';
import { Environment } from "../../../shared/environment";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CategoriaService, ViewCategoria } from "../../../shared/services/api/Estoque/CategoriaService";
import AdicionarCategoria from "./AdicionarCategoria";


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

    const handleOpenCategoria = () => setOpenCategoria(true);
    const handleCloseCategoria = () => setOpenCategoria(false);

    const consultar = async () => {
        setIsLoading(true);
        try {
            const consulta = await CategoriaService.consultaCategoria();
            if (consulta instanceof Error) {
                alert(consulta.message);
                setRows([]);
            } else if (Array.isArray(consulta)) {
                setRows(consulta);
            } else if (typeof consulta === 'object') {
                setRows([consulta]);
            } else {
                setRows([]);
                alert('Dados retornados não são válidos');
            }
        } catch (error) {
            alert('Erro ao consultar clientes');
            setRows([]);
        }
        setIsLoading(false);
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

    useEffect(() => {
        consultar();
    }, []);

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
                    maxWidth: "70%",
                }}
            >
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
                                        </TableRow>
                                    ))
                                )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <AdicionarCategoria open={openCategoria} onClose={handleCloseCategoria} title="Nova categoria" onSubmit={handleSubmitCategoria} />

            </Box>
        </Modal>
    );
};
