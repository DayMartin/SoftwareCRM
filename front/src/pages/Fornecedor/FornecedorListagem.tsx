import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { IListagemFornecedor, FornecedorService } from "../../shared/services/api/Fornecedor/FornecedorService";
import { BarraUsuarios } from "../../shared/components";
import { LayoutBaseDePagina } from "../../shared/layouts";
import FornecedorDialog from "./components/VisualizarFornecedor";
import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { BarraInicial } from "../../shared/components/barra-inicial/BarraInicial";
import { BarraFornecedor } from "./components/BarraFornecedor";

export const Fornecedor: React.VFC = () => {
    const [rows, setRows] = useState<IListagemFornecedor[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedFornecedor, setSelectedFornecedor] = useState<IListagemFornecedor | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); 
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);


    const titulo = "Fornecedor";

    const consultar = async () => {
        setIsLoading(true);
        try {
            const consulta = await FornecedorService.getFornecedorList(page + 1, filterId);

            if (consulta instanceof Error) {
                // alert(consulta.message);
                setRows([]);
                setTotalRecords(0);
            } else {
                setRows(consulta.rows);
                setTotalRecords(consulta.total);
            }
        } catch (error) {
            // alert('Erro ao consultar clientes');
            setRows([]);
            setTotalRecords(0);
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


    const handleVisualizar = (client: IListagemFornecedor) => {
        setSelectedFornecedor(client);
        setOpen(true);
        setIsEditing(false);
    };

    const handleEditar = (client: IListagemFornecedor) => {
        setSelectedFornecedor(client);
        setOpen(true);
        setIsEditing(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFornecedor(null);
        setIsEditing(false);
    };

    const handleSave = async (updatedClient: IListagemFornecedor) => {
        try {
            await FornecedorService.updateById(updatedClient.id, updatedClient);
            await consultar();
        } catch (error) {
            alert('Erro ao atualizar fornecedor');
        }
    };

    const handleDesativar = async (id: string) => {
        try {
            await FornecedorService.deleteById(id);
            await consultar();
        } catch (error) {
            alert('Erro ao desativar fornecedor');
        }
    };

    const handleAtivar = async (id: string) => {
        try {
            await FornecedorService.ativarById(id);
            await consultar();
        } catch (error) {
            alert('Erro ao ativar fornecedor');
        }
    };

    const listar = async() => {
        try {
            await consultar();
        } catch (error) {
            console.error('Erro ao listar', error)
        }
    }

    return (
        <Box>
            <BarraInicial
                titulo={titulo}
                onFilterIdChange={handleFilterIdChange}
            />
            <BarraFornecedor listar={listar}/>
            <TableContainer component={Paper} sx={{ m: 1, width: 'auto', marginLeft: '8%', marginRight: '2%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>CNPJ/CPF</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.nome}</TableCell>
                                <TableCell>{row.cpfcnpj}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.telefone}</TableCell>
                                <TableCell>
                                    {row.status === 'ativo' ? (
                                        <CheckCircleIcon color="success" />
                                    ) : (
                                        'Inativo'
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button onClick={() => handleVisualizar(row)}>
                                        <VisibilityIcon />
                                    </Button>
                                    <Button onClick={() => handleEditar(row)}>
                                        <EditIcon />
                                    </Button>
                                    {row.status === 'ativo' ? (
                                        <Button onClick={() => handleDesativar(row.id)}>
                                            <DeleteIcon color="error" />
                                        </Button>
                                    ) : (
                                        <Button onClick={() => handleAtivar(row.id)}>
                                            <CheckCircleIcon color="success" />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5]}
                component="div"
                count={totalRecords} // Ajustado para o total de registros
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
            {selectedFornecedor && (
                <FornecedorDialog
                    open={open}
                    client={selectedFornecedor}
                    isEditing={isEditing}
                    onClose={handleClose}
                    onSave={handleSave}
                />
            )}


            {isLoading && <LinearProgress />}
        </Box>
    );
};
