import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { UsersService, IListagemCliente } from "../../../shared/services";
import {
  EstoqueService,
  IDetalheEstoque,
} from "../../../shared/services/api/Estoque/EstoqueService";
import { VendasService, IParcelaCreate } from "../../../shared/services/api/Vendas/VendasService";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

interface AdicionarVendasProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: any) => void;
}

const AdicionarVendas: React.FC<AdicionarVendasProps> = ({
  open,
  onClose,
  title,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    cliente_id: 0,
    funcionario_id: 0,
    QTparcelas: 0,
    valorTotal: 0,
    valorDesconto: 0,
    status: "Pendente",
    parcelas: [
      {
        parcela: 0,
        valorParcela: 0,
        dataPagamento: "",
        status: "Pendente",
        venda_id: 0,
      },
    ],
    produtos: [
      {
        quantidade: 0,
        id: 0,
      },
    ],
  });
  const [clientes, setClientes] = useState<IListagemCliente[]>([]);
  const [funcionarios, setFuncionario] = useState<IListagemCliente[]>([]);
  const [produtos, setProdutos] = useState<IDetalheEstoque[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | "">("");
  const [quantidade, setQuantidade] = useState<number>(1);
  const [abaSelecionada, setAbaSelecionada] = useState<number>(0);

  // Funções de consulta
  const ConsultarClientes = async () => {
    try {
      const consultar = await UsersService.getClientes("cliente");
      if (consultar instanceof Error) {
        console.error("Erro ao consultar clientes:", consultar.message);
      } else {
        setClientes(consultar.filter((item) => item.status === "ativo"));
      }
    } catch (error) {
      console.error("Erro ao consultar clientes:", error);
    }
  };

  const ConsultarFuncionarios = async () => {
    try {
      const consultarFuncionario = await UsersService.getClientes(
        "funcionario"
      );
      if (consultarFuncionario instanceof Error) {
        console.error(
          "Erro ao consultar funcionários:",
          consultarFuncionario.message
        );
      } else {
        setFuncionario(
          consultarFuncionario.filter((item) => item.status === "ativo")
        );
      }
    } catch (error) {
      console.error("Erro ao consultar funcionários:", error);
    }
  };

  const ConsultarEstoque = async () => {
    try {
      const consultarEstoque = await EstoqueService.getAll();
      if (consultarEstoque instanceof Error) {
        console.error("Erro ao consultar estoque:", consultarEstoque.message);
      } else {
        setProdutos(consultarEstoque.filter((item) => item.quantidade > 0));
      }
    } catch (error) {
      console.error("Erro ao consultar estoque:", error);
    }
  };

  useEffect(() => {
    ConsultarClientes();
    ConsultarFuncionarios();
    ConsultarEstoque();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<number | "">) => {
    const { name, value } = event.target;
    if (name === "produto_id") {
      setProdutoSelecionado(value as number | "");
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value as number,
      }));
    }
  };

  const handleAddProduto = () => {
    const produto = produtos.find((p) => p.id === produtoSelecionado);
    if (produto) {
      const produtoExistente = formData.produtos.find(
        (p) => p.id === produto.id
      );
      if (produtoExistente) {
        setFormData((prevData) => ({
          ...prevData,
          produtos: prevData.produtos.map((p) =>
            p.id === produto.id
              ? { ...p, quantidade: p.quantidade + quantidade }
              : p
          ),
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          produtos: [...prevData.produtos, { id: produto.id, quantidade }],
        }));
      }
      atualizarValorTotal(produto.valorUnitario * quantidade);
      setQuantidade(1); // Resetar quantidade
      setProdutoSelecionado(0); // Resetar produto selecionado
    }
  };

  const handleRemoveProduto = (id: number) => {
    const produto = formData.produtos.find((p) => p.id === id);
    if (produto) {
      const valorProduto =
        produto.quantidade *
        (produtos.find((p) => p.id === id)?.valorUnitario || 0);
      setFormData((prevData) => ({
        ...prevData,
        produtos: prevData.produtos.filter((p) => p.id !== id),
        valorTotal: prevData.valorTotal - valorProduto,
      }));
    }
  };

  const atualizarValorTotal = (valor: number) => {
    setFormData((prevData) => ({
      ...prevData,
      valorTotal: prevData.valorTotal + valor,
    }));
  };

  const handleDescontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const desconto = Number(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      valorDesconto: desconto,
    }));
  };

  const resetForm = () => {
    setFormData({
      cliente_id: 0,
      funcionario_id: 0,
      QTparcelas: 0,
      valorTotal: 0,
      valorDesconto: 0,
      status: "",
      parcelas: [
        {
          parcela: 0,
          valorParcela: 0,
          dataPagamento: "",
          status: "Pendente",
          venda_id: 0,
        },
      ],
      produtos: [],
    });
  };

  const valorTotalFinal = formData.valorTotal - formData.valorDesconto;

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
          maxWidth: "800px",
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Tabs
          value={abaSelecionada}
          onChange={(e, newValue) => setAbaSelecionada(newValue)}
          variant="fullWidth"
        >
          <Tab label="Dados Gerais" />
          <Tab label="Produtos" />
          <Tab label="Pagamento" />
        </Tabs>
        <Box component="form" mt={2}>
          {abaSelecionada === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="cliente-label">Cliente</InputLabel>
                  <Select
                    labelId="cliente-label"
                    name="cliente_id"
                    value={formData.cliente_id}
                    onChange={handleSelectChange}
                    displayEmpty
                  >
                    {clientes.map((cliente) => (
                      <MenuItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="funcionario-label">Vendedor</InputLabel>
                  <Select
                    labelId="funcionario-label"
                    name="funcionario_id"
                    value={formData.funcionario_id}
                    onChange={handleSelectChange}
                    displayEmpty
                  >
                    {funcionarios.map((funcionario) => (
                      <MenuItem key={funcionario.id} value={funcionario.id}>
                        {funcionario.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="number"
                  label="Desconto"
                  name="valorDesconto"
                  value={formData.valorDesconto}
                  onChange={handleDescontoChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
            </Grid>
          )}
          {abaSelecionada === 1 && (
            <Box>
              <Grid container spacing={2} sx={{ alignItems: "center" }}>
                <Grid item xs={12} sm={5}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="produto-label">Produto</InputLabel>
                    <Select
                      labelId="produto-label"
                      name="produto_id"
                      value={produtoSelecionado}
                      onChange={handleSelectChange}
                      displayEmpty
                    >
                      {produtos.map((produto) => (
                        <MenuItem key={produto.id} value={produto.id}>
                          {produto.nome} - R$ {produto.valorUnitario.toFixed(2)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    type="number"
                    label="Quantidade"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddProduto}
                    fullWidth
                  >
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>
              <TableContainer
                component={Paper}
                sx={{ mt: 2, maxHeight: "150px", overflowY: "auto" }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#F0F0F0" }}>
                    <TableRow>
                      <TableCell sx={{ p: 0.1, paddingLeft: "8px" }}>
                        Produto
                      </TableCell>
                      <TableCell sx={{ p: 0.1 }}>Quantidade</TableCell>
                      <TableCell sx={{ p: 0.1 }}>Valor Unitário</TableCell>
                      <TableCell sx={{ p: 0.1 }}>Valor Total</TableCell>
                      <TableCell sx={{ p: 0.1 }}>Ação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ backgroundColor: "#fafafa" }}>
                    {formData.produtos.map((produto, index) => {
                      const detalheProduto = produtos.find(
                        (p) => p.id === produto.id
                      );
                      const valorTotal =
                        (detalheProduto?.valorUnitario || 0) *
                        produto.quantidade;
                      return (
                        <TableRow key={index}>
                          <TableCell sx={{ p: 0.1, paddingLeft: "8px" }}>
                            {detalheProduto?.nome}
                          </TableCell>
                          <TableCell sx={{ p: 0.1 }}>
                            {produto.quantidade}
                          </TableCell>
                          <TableCell sx={{ p: 0.1 }}>
                            R$ {detalheProduto?.valorUnitario.toFixed(2)}
                          </TableCell>
                          <TableCell sx={{ p: 0.1 }}>
                            R$ {valorTotal.toFixed(2)}
                          </TableCell>
                          <TableCell sx={{ p: 0.1 }}>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveProduto(produto.id)}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          {abaSelecionada === 2 && (
            <Box>
              <Grid container spacing={2} sx={{ alignItems: "center" }}>
                <Grid item xs={12} sm={5}>
                  <TextField
                    type="number"
                    label="Quantidade de parcelas"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddProduto}
                    fullWidth
                  >
                    <AddIcon />
                  </Button>
                </Grid>
              </Grid>
              <TableContainer
                component={Paper}
                sx={{ mt: 2, maxHeight: "150px", overflowY: "auto" }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#F0F0F0" }}>
                    <TableRow>
                      <TableCell sx={{ p: 0.1, paddingLeft: "8px" }}>
                        Produto
                      </TableCell>
                      <TableCell sx={{ p: 0.1 }}>Quantidade</TableCell>
                      <TableCell sx={{ p: 0.1 }}>Valor Unitário</TableCell>
                      <TableCell sx={{ p: 0.1 }}>Valor Total</TableCell>
                      <TableCell sx={{ p: 0.1 }}>Ação</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ backgroundColor: "#fafafa" }}>
                    {formData.produtos.map((produto, index) => {
                      const detalheProduto = produtos.find(
                        (p) => p.id === produto.id
                      );
                      const valorTotal =
                        (detalheProduto?.valorUnitario || 0) *
                        produto.quantidade;
                      return (
                        <TableRow key={index}>
                          <TableCell sx={{ p: 0.1, paddingLeft: "8px" }}>
                            {detalheProduto?.nome}
                          </TableCell>
                          <TableCell sx={{ p: 0.1 }}>
                            {produto.quantidade}
                          </TableCell>
                          <TableCell sx={{ p: 0.1 }}>
                            R$ {detalheProduto?.valorUnitario.toFixed(2)}
                          </TableCell>
                          <TableCell sx={{ p: 0.1 }}>
                            R$ {valorTotal.toFixed(2)}
                          </TableCell>
                          <TableCell sx={{ p: 0.1 }}>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveProduto(produto.id)}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          <Box mt={2}>
            <Typography variant="h6">
              Desconto: R$ {formData.valorDesconto.toFixed(2)}
            </Typography>

            <Typography variant="h6">
              Total: R$ {valorTotalFinal.toFixed(2)}
            </Typography>
          </Box>
          <Grid container spacing={1} mt={1}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  onSubmit(formData);
                  resetForm();
                  onClose();
                }}
                fullWidth
              >
                Efetuar venda
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                fullWidth
              >
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default AdicionarVendas;
