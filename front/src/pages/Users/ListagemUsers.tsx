import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { LayoutBaseDePagina } from "../../shared/layouts";
import UsersDialog from "./components/VisualizarUsers";
import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { BarraInicial } from "../../shared/components/barra-inicial/BarraInicial";
import { BarraUsers } from "./components/BarraUsers";
import { IListagemUser, UsersService } from "../../shared/services";
import Comissao from "./components/Comissao";

export const Users: React.VFC = () => {
    const [rows, setRows] = useState<IListagemUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<IListagemUser | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); 
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [openModalVendas, setOpenModalVendas] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedVendedorForVendas, setSelectedVendedorForVendas] = useState<number | null>(null);
    const [selectedVendedorForVendasName, setSelectedVendedorForVendasName] = useState<IListagemUser | null>(null);


    const titulo = "Funcionários";

    const consultar = async () => {
        setIsLoading(true);
        try {
            const consulta = await UsersService.getUsersList(page + 1, filterId);

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


    const handleVisualizar = (client: IListagemUser) => {
        setSelectedUsers(client);
        setOpen(true);
        setIsEditing(false);
    };

    const handleEditar = (client: IListagemUser) => {
        setSelectedUsers(client);
        setOpen(true);
        setIsEditing(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUsers(null);
        setIsEditing(false);
    };

    const handleSave = async (updatedClient: IListagemUser) => {
        try {
            await UsersService.updateById(updatedClient.id, updatedClient);
            await consultar();
        } catch (error) {
            alert('Erro ao atualizar Users');
        }
    };

    const handleDesativar = async (id: string) => {
        try {
            await UsersService.deleteById(id);
            await consultar();
        } catch (error) {
            alert('Erro ao desativar Users');
        }
    };

    const handleAtivar = async (id: string) => {
        try {
            await UsersService.ativarById(id);
            await consultar();
        } catch (error) {
            alert('Erro ao ativar Users');
        }
    };

    const listar = async() => {
        try {
            await consultar();
        } catch (error) {
            console.error('Erro ao listar', error)
        }
    }

    const handleOpenModalVendas = (client: IListagemUser) => {
        const idN = Number(client.id)
        setSelectedVendedorForVendas(idN);
        setSelectedVendedorForVendasName(client);

        setOpenModalVendas(true);
    };
    

    const handleCloseModalVendas = () => {
        setOpenModalVendas(false);
        setSelectedVendedorForVendas(null);
    };

    return (
        <Box>
            <BarraInicial
                titulo={titulo}
                onFilterIdChange={handleFilterIdChange}
            />
            <BarraUsers listar={listar}/>
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
                                    <Button onClick={() => handleOpenModalVendas(row)}>
                                        <PaidIcon />
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
            {selectedUsers && (
                <UsersDialog
                    open={open}
                    client={selectedUsers}
                    isEditing={isEditing}
                    onClose={handleClose}
                    onSave={handleSave}
                />
            )}
            {openModalVendas && (
                <Comissao
                    open={openModalVendas}
                    onClose={handleCloseModalVendas}
                    funcionario_id={selectedVendedorForVendas}
                    title={`Comissões do vendedor: ${selectedVendedorForVendasName?.nome || ''}`}

                />
            )}

            {isLoading && <LinearProgress />}
        </Box>
    );
};
