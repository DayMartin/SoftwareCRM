import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IListagemCliente, UsersService } from "../../../shared/services/api/Users/UsersService";
import { BarraUsuarios } from "../../../shared/components";
import { LayoutBaseDePagina } from "../../../shared/layouts";
import { Environment } from "../../../shared/environment";
import ClienteDialog from "../components/VisualizarUsers";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { BarraInicial } from "../../../shared/components/barra-inicial/BarraInicial";

export const Cliente: React.VFC = () => {
    const [rows, setRows] = useState<IListagemCliente[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<IListagemCliente | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState<string>('cliente'); // Novo estado para o tipo de usuário

    const consultar = async (tipo: string) => {
        setIsLoading(true);
        try {
            const consulta = await UsersService.getClientes(tipo);
            console.log('Consulta recebida:', consulta);

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

    useEffect(() => {
        consultar(tipoUsuario);
    }, [tipoUsuario]);

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
            <BarraUsuarios onTipoChange={setTipoUsuario} /> {/* Passa a função de atualização */}
            <TableContainer component={Paper} sx={{ m: 1, width: 'auto', marginLeft: '6%', marginRight: '2%' }}>
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
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <LinearProgress variant='indeterminate' />
                                </TableCell>
                            </TableRow>
                        ) : (
                            rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        {Environment.LISTAGEM_VAZIA}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map(row => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.nome}</TableCell>
                                        <TableCell>{row.cpfcnpj}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.telefone}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleVisualizar(row)}
                                                sx={{ mr: 1 }}
                                            >
                                                <VisibilityIcon />
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleEditar(row)}
                                                sx={{ mr: 1 }}
                                            >
                                                <EditIcon />
                                            </Button>
                                            {row.status === 'ativo' ? (
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() => handleDesativar(row.id)}
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => handleAtivar(row.id)}
                                                >
                                                    <CheckCircleIcon />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <ClienteDialog
                open={open}
                onClose={handleClose}
                client={selectedClient}
                onSave={handleSave}
                isEditing={isEditing}
            />
        </Box>
    );
};
