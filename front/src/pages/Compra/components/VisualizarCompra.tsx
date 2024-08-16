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
import { CompraService, IParcela } from "../../../shared/services/api/Compra/CompraService";
import { ParcelasService } from "../../../shared/services/api/Compra/ParcelasCompraService";
import { EstoqueService, IDetalheHistoric } from "../../../shared/services/api/Estoque/EstoqueService";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import PaymentsIcon from '@mui/icons-material/Payments';
import { ICompraDetalhe } from "../../../shared/services/api/Compra/CompraService";

interface CompraDialogProps {
  open: boolean;
  onClose: () => void;
  compra: ICompraDetalhe | null;
  onSave?: (compra: ICompraDetalhe) => void;
  isEditing: boolean;
}

const CompraDialog: React.FC<CompraDialogProps> = ({
  open,
  onClose,
  compra,
  onSave,
  isEditing,
}) => {
  const [editCompra, setEditCompra] = React.useState<ICompraDetalhe | null>(null);
  const [parcelas, setParcelas] = React.useState<IParcela[]>([]);
  const [produtos, setProdutos] = React.useState<IDetalheHistoric[]>([]);
  const [tabValue, setTabValue] = React.useState(0); // Estado para controlar a aba ativa

  React.useEffect(() => {
    if (compra) {
      setEditCompra(compra);
      BuscarParcelas(compra.id);
      BuscarProdutos(compra.id);
    }
  }, [compra]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editCompra) {
      setEditCompra({
        ...editCompra,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSave = () => {
    if (editCompra && onSave) {
      onSave(editCompra);
    }
  };

  const BuscarParcelas = async (id: number) => {
    try {
      const response = await CompraService.getByCompra(id);
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
      const response = await CompraService.getByProdutoMovimento(id);
      if (response instanceof Error) {
        alert(response.message);
      } else {
        setProdutos(response || []);
      }
    } catch (error) {
      alert("Erro ao buscar produtos");
    }
  };

  const buscarNomeProduto = async (id: number) => {
    try {
      await EstoqueService.getByID(id);
    } catch (error) {
      alert('Erro ao consulta');
    }
  }

  const handleReceber = async (id: number, idcompra: number, valorPago: number) => {
    try {
      await ParcelasService.receberById(id, idcompra, valorPago);
      await BuscarParcelas(idcompra)
    } catch (error) {
      alert('Erro ao receber');
    }
  };

  const handleDesfazerReceber = async (id: number, idcompra: number, valorPago: number) => {
    try {
      await ParcelasService.refazerReceberById(id, valorPago);
      await BuscarParcelas(idcompra)

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
            {isEditing ? "Editar Compra" : "Detalhes da Compra"}
          </Typography>
          {editCompra && (
            <Typography variant="h6" color="textSecondary">
              Compra ID: {editCompra.id}
            </Typography>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        {editCompra ? (
          <>
            {/* Tabs para Parcelas e Produtos */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Compra Tabs"
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
                      <TableCell>Forma de Pagamento</TableCell>

                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parcelas.map((parcela, index) => (
                      <TableRow key={index}>
                        <TableCell>{parcela.parcela}</TableCell>
                        <TableCell>{parcela.valorParcela}</TableCell>
                        <TableCell>{parcela.dataPagamento}</TableCell>
                        <TableCell>{parcela.tipoPagamento}</TableCell>
                        <TableCell>{parcela.status}</TableCell>
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                          {parcela.status === "pendente" ? (
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleReceber(parcela.id, parcela.compra_id, parcela.valorParcela)}
                              sx={{ height: "24px" }}
                            >
                              <PaymentsIcon />

                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleDesfazerReceber(parcela.id, parcela.compra_id, parcela.valorParcela)}
                              sx={{ height: "24px" }}
                            >
                              <DoNotDisturbOnIcon />
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
          <Typography variant="body1">Nenhuma compra selecionada.</Typography>
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

export default CompraDialog;
