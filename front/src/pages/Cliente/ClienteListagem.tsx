import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PaidIcon from '@mui/icons-material/Paid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { BarraInicial } from "../../shared/components/barra-inicial/BarraInicial";
import { IListagemCliente, ClienteService } from "../../shared/services/api/Cliente/ClienteService";
import ClienteDialog from "./components/VisualizarCliente";
import { BarraClientes } from "./components/BarraClientes"
import ClienteCompras from "./components/ClienteCompras";


export const ListagemCliente: React.VFC = () => {
    const [rows, setRows] = useState<IListagemCliente[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState<IListagemCliente | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5); 
    const [filterId, setFilterId] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [openModalVendas, setOpenModalVendas] = useState(false);
    const [selectedClientForVendas, setSelectedClientForVendas] = useState<number | null>(null);
    const [selectedClientForVendasName, setSelectedClientForVendasName] = useState<IListagemCliente | null>(null);

    const titulo = "Cliente";

    const consultar = async () => {
        setIsLoading(true);
        try {
            const consulta = await ClienteService.getClienteList(page + 1, filterId);

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


    const handleVisualizar = (client: IListagemCliente) => {
        setSelectedCliente(client);
        setOpen(true);
        setIsEditing(false);
    };

    const handleEditar = (client: IListagemCliente) => {
        setSelectedCliente(client);
        setOpen(true);
        setIsEditing(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCliente(null);
        setIsEditing(false);
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


    const handleSave = async (updatedClient: IListagemCliente) => {
        try {
            await ClienteService.updateById(updatedClient.id, updatedClient);
            await consultar();
        } catch (error) {
            alert('Erro ao atualizar cliente');
        }
    };

    const handleDesativar = async (id: string) => {
        try {
            await ClienteService.deleteById(id);
            await consultar();
        } catch (error) {
            alert('Erro ao desativar cliente');
        }
    };

    const handleAtivar = async (id: string) => {
        try {
            await ClienteService.ativarById(id);
            await consultar();
        } catch (error) {
            alert('Erro ao ativar cliente');
        }
    };

    return (
        <Box>
            <BarraInicial
                titulo={titulo}
                onFilterIdChange={handleFilterIdChange}
            />
            <BarraClientes/>
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
            {selectedCliente && (
                <ClienteDialog
                    open={open}
                    client={selectedCliente}
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
