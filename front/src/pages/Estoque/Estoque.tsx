import * as React from "react";
import { useState, useEffect } from 'react';
import { Box, Button, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { EstoqueService, IDetalheEstoque, IDetalheHistoric } from "../../shared/services/api/Estoque/EstoqueService";
import { Environment } from "../../shared/environment";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BarraInicial } from "../../shared/components/barra-inicial/BarraInicial";
import { BarraEstoque } from "./components/BarraEstoque";
import DeleteIcon from '@mui/icons-material/Delete';

export const Estoque: React.VFC = () => {
    const [rows, setRows] = useState<IDetalheEstoque[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedEstoque, setSelectedEstoque] = useState<IDetalheEstoque | null>(null);
    const [historicoEstoque, setHistoricoEstoque] = useState<IDetalheHistoric[] | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState<string>('cliente');
    const titulo = "Estoque";

    const consultar = async (tipo: string) => {
        setIsLoading(true);
        try {
            const consulta = await EstoqueService.getAll();
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

    const handleVisualizar = async (estoque: IDetalheEstoque) => {
        setSelectedEstoque(estoque);
        setIsEditing(false);
        setOpen(true);
        try {
            const historico = await EstoqueService.getByHistoric(estoque.id);
            if (historico instanceof Error) {
                alert(historico.message);
            } else {
                setHistoricoEstoque(historico);
            }
        } catch (error) {
            alert('Erro ao consultar histórico');
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedEstoque(null);
        setHistoricoEstoque(null);
        setIsEditing(false);
    };

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'Saída':
                return { color: 'red' };
            case 'entrada':
                return { color: 'green' };
            default:
                return { fontWeight: 'bold' };
        }
    };

    const handleExcluir = async (id: number) => {
        try {
          const result = await EstoqueService.deleteEstoqueById(id);
      
          if (result instanceof Error) {
            console.error(result.message); 
            alert(result.message);
            return;
          }
      
          alert("Estoque excluído com sucesso!");
      
        } catch (error) {
          console.error("Erro inesperado:", error);
        }
      };

    return (
        <Box>
            <BarraInicial titulo={titulo} />
            <BarraEstoque/>

            <TableContainer component={Paper} sx={{ m: 1, width: 'auto', marginLeft: '8%', marginRight: '2%' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Categoria</TableCell>
                            <TableCell>Marca</TableCell>
                            <TableCell>Fornecedor</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Valor Unitário</TableCell>
                            <TableCell>Data de criação</TableCell>
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
                                        <TableCell>{row.categoria_id}</TableCell>
                                        <TableCell>{row.marca_id}</TableCell>
                                        <TableCell>{row.fornecedor_id}</TableCell>
                                        <TableCell
                                            sx={{
                                                color: row.quantidade < 2 ? 'red' : 'inherit'
                                            }}
                                        >{row.quantidade}</TableCell>
                                        <TableCell>{row.valorUnitario}</TableCell>
                                        <TableCell>{row.data_criacao}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleVisualizar(row)}
                                                sx={{ mr: 1, height: '24px' }}
                                            >
                                                <VisibilityIcon />
                                            </Button>
                                            {/* <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleEditar(row)}
                                                sx={{ mr: 1, height:'24px' }}
                                            >
                                                <EditIcon />
                                            </Button> */}
                                        </TableCell>
                                        <TableCell>
                                                <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleExcluir(row.id)}
                                                sx={{ mr: 1, height:'24px' }}
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

            {/* Modal para Exibir Histórico --- ENVIAR PARA UM COMPONENT SEPERADO*/}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Histórico do Estoque</DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#F0F0F0" }}>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Compra</TableCell>
                                <TableCell>Venda</TableCell>
                                <TableCell>Quantidade</TableCell>
                                <TableCell>Estoque</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Data</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {historicoEstoque && historicoEstoque.length > 0 ? (
                                historicoEstoque.map(historico => (
                                    <TableRow key={historico.id}>
                                        <TableCell>{historico.id}</TableCell>
                                        <TableCell>{historico.compra_id || 'Não se aplica'}</TableCell>
                                        <TableCell>{historico.venda_id || 'Não se aplica'}</TableCell>
                                        <TableCell>{historico.quantidade}</TableCell>
                                        <TableCell>{historico.estoque_id}</TableCell>
                                        <TableCell>
                                            <Typography sx={getTipoColor(historico.tipo)}>
                                                {historico.tipo}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{historico.data_criacao}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        Nenhum histórico encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DialogContent>
                <Button onClick={handleClose} color="primary">
                    Fechar
                </Button>
            </Dialog>
        </Box>
    );
};
