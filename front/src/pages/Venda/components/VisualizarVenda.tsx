import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import {
  IVendaDetalhe,
  VendasService,
  IParcela,
} from "../../../shared/services/api/Vendas/VendasService";
import { EstoqueService, IDetalheHistoric } from "../../../shared/services/api/Estoque/EstoqueService";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface VendaDialogProps {
  open: boolean;
  onClose: () => void;
  venda: IVendaDetalhe | null;
  onSave?: (venda: IVendaDetalhe) => void;
  isEditing: boolean;
}

const VendaDialog: React.FC<VendaDialogProps> = ({
  open,
  onClose,
  venda,
  onSave,
  isEditing,
}) => {
  const [editVenda, setEditVenda] = React.useState<IVendaDetalhe | null>(null);
  const [parcelas, setParcelas] = React.useState<IParcela[]>([]);
  const [produtos, setProdutos] = React.useState<IDetalheHistoric[]>([]);
  const [tabValue, setTabValue] = React.useState(0); // Estado para controlar a aba ativa

  React.useEffect(() => {
    if (venda) {
      setEditVenda(venda);
      BuscarParcelas(venda.id);
      BuscarProdutos(venda.id);
    }
  }, [venda]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editVenda) {
      setEditVenda({
        ...editVenda,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = () => {
    if (editVenda && onSave) {
      onSave(editVenda);
    }
  };

  const BuscarParcelas = async (id: number) => {
    try {
      const response = await VendasService.getByVenda(id);
      if (response instanceof Error) {
        alert(response.message);
      } else {
        setParcelas(response || []);
      }
    } catch (error) {
      alert("Erro ao buscar parcelas");
    }
  };

  const BuscarProdutos = async (id: number) => {
    try {
      const response = await VendasService.getByHistoricVenda(id);
      if (response instanceof Error) {
        alert(response.message);
      } else {
        setProdutos(response || []);
      }
    } catch (error) {
      alert("Erro ao buscar produtos");
    }
  };

  const buscarNomeProduto = async(id:number) => {
    try {
      await EstoqueService.getByID(id);
    } catch (error) {
      alert('Erro ao consulta');
    }
  }

  const handleReceber = async (id: number, idvenda:number) => {
    try {
      await VendasService.receberById(id);
      await BuscarParcelas(idvenda)
    } catch (error) {
      alert('Erro ao receber');
    }
  };

  const handleDesfazerReceber = async (id: number, idvenda:number) => {
    try {
      await VendasService.refazerReceberById(id);
      await BuscarParcelas(idvenda)

    } catch (error) {
      alert('Erro ao desfazer o receber');
    }
  };


  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Typography variant="h6" flexGrow={1}>
            {isEditing ? "Editar Venda" : "Detalhes da Venda"}
          </Typography>
          {editVenda && (
            <Typography variant="h6" color="textSecondary">
              Venda ID: {editVenda.id}
            </Typography>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        {editVenda ? (
          <>
            {/* Tabs para Parcelas e Produtos */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Venda Tabs"
            >
              <Tab label="Parcelas" />
              <Tab label="Produtos" />
            </Tabs>

            {/* Conteúdo da Aba de Parcelas */}
            {tabValue === 0 && (
              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Número da Parcela</TableCell>
                      <TableCell>Valor da Parcela</TableCell>
                      <TableCell>Data de Vencimento</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parcelas.map((parcela, index) => (
                      <TableRow key={index}>
                        <TableCell>{parcela.parcela}</TableCell>
                        <TableCell>{parcela.valorParcela}</TableCell>
                        <TableCell>{parcela.dataPagamento}</TableCell>
                        <TableCell>{parcela.status}</TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          {parcela.status === "pendente" ? (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleReceber(parcela.id, parcela.venda_id)}
                              sx={{ height: "24px" }}
                            >
                              <CheckCircleIcon />

                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDesfazerReceber(parcela.id, parcela.venda_id)}
                              sx={{ height: "24px" }}
                            >
                              <DeleteIcon />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Conteúdo da Aba de Produtos */}
            {tabValue === 1 && (
              <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto ID</TableCell>
                      <TableCell>Estoque ID</TableCell>
                      <TableCell>Quantidade</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Data de Criação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {produtos.map((produto, index) => (
                      <TableRow key={index}>
                        <TableCell>{produto.id}</TableCell>
                        <TableCell>{produto.estoque_id}</TableCell>
                        <TableCell>{produto.quantidade}</TableCell>
                        <TableCell>{produto.tipo}</TableCell>
                        <TableCell>{produto.data_criacao}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </>
        ) : (
          <Typography variant="body1">Nenhuma venda selecionada.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        {isEditing && (
          <Button onClick={handleSave} color="primary">
            Salvar
          </Button>
        )}
        <Button onClick={onClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VendaDialog;
