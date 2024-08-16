import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import { IListagemCliente, UsersService } from "../../../shared/services/api/Users/UsersService";
import { BarraUsuarios } from "../../../shared/components";
import { LayoutBaseDePagina } from "../../../shared/layouts";
import ClienteDialog from "../components/VisualizarUsers";
import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { BarraInicial } from "../../../shared/components/barra-inicial/BarraInicial";
import ClienteCompras from "./ClienteCompras";

export const Cliente: React.VFC = () => {
    const [rows, setRows] = useState<IListagemCliente[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<IListagemCliente | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState<string>('cliente');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); // Ajustado para 5 conforme o backend
    const [filterId, setFilterId] = useState('');
    const [filterName, setFilterName] = useState('');
    const [totalRecords, setTotalRecords] = useState(0); // Adicionado para total de registros
    const [openModalVendas, setOpenModalVendas] = useState(false);
    const [selectedClientForVendas, setSelectedClientForVendas] = useState<number | null>(null);
    const [selectedClientForVendasName, setSelectedClientForVendasName] = useState<IListagemCliente | null>(null);

    const titulo = "Cadastros";

    const consultar = async (tipo: string) => {
        setIsLoading(true);
        try {
            const consulta = await UsersService.getClientesList(page + 1, filterId, filterName, tipo);

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
        consultar(tipoUsuario);
    }, [tipoUsuario, page, filterId, filterName]);

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


    const handleOpenModalVendas = (client: IListagemCliente) => {
        const idN = Number(client.id)
        setSelectedClientForVendas(idN);
        setSelectedClientForVendasName(client);
        setOpenModalVendas(true);
    };
    

    const handleCloseModalVendas = () => {
        setOpenModalVendas(false);
        setSelectedClientForVendas(null);
    };


    const handleVisualizar = (client: IListagemCliente) => {
        setSelectedClient(client);
        setOpen(true);
        setIsEditing(false);
    };

    const handleEditar = (client: IListagemCliente) => {
        setSelectedClient(client);
        setOpen(true);
        setIsEditing(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedClient(null);
        setIsEditing(false);
    };

    const handleSave = async (updatedClient: IListagemCliente) => {
        try {
            await UsersService.updateById(updatedClient.id, updatedClient);
            await consultar(tipoUsuario);
        } catch (error) {
            alert('Erro ao atualizar cliente');
        }
    };

    const handleDesativar = async (id: string) => {
        try {
            await UsersService.deleteById(id);
            await consultar(tipoUsuario);
        } catch (error) {
            alert('Erro ao desativar usuário');
        }
    };

    const handleAtivar = async (id: string) => {
        try {
            await UsersService.ativarById(id);
            await consultar(tipoUsuario);
        } catch (error) {
            alert('Erro ao ativar usuário');
        }
    };

    return (
        <Box>
            <BarraInicial
                titulo={titulo}
                onFilterIdChange={handleFilterIdChange}
            />
            <BarraUsuarios onTipoChange={setTipoUsuario} />
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
                                    <Button onClick={() => handleOpenModalVendas(row)}>
                                        <PaidIcon />
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
            {selectedClient && (
                <ClienteDialog
                    open={open}
                    client={selectedClient}
                    isEditing={isEditing}
                    onClose={handleClose}
                    onSave={handleSave}
                />
            )}
            {openModalVendas && (
                <ClienteCompras
                    open={openModalVendas}
                    onClose={handleCloseModalVendas}
                    clienteId={selectedClientForVendas}
                    title={`Compras do Cliente: ${selectedClientForVendasName?.nome || ''}`}
                />
            )}


            {isLoading && <LinearProgress />}
        </Box>
    );
};
