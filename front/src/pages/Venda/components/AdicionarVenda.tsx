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
  Autocomplete,
  CircularProgress
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { UsersService, IListagemUser } from "../../../shared/services";
import {
  EstoqueService,
  IDetalheEstoque,
  ViewCategoria,
  ViewItemProduto,
} from "../../../shared/services/api/Estoque/EstoqueService";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { MarcaService, ViewMarca } from "../../../shared/services/api/Estoque/MarcaService";
import { CategoriaService } from "../../../shared/services/api/Estoque/CategoriaService";
import { ClienteService, IListagemCliente } from "../../../shared/services/api/Cliente/ClienteService";
import { VendaType } from "../../../core/venda.type";
import { generatePDFOrcamento } from "../../../shared/components/pdf/pdfOrcamento";


interface AdicionarVendasProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: any) => void;
}

// Define o tipo para ItemProduto
interface ItemProduto {
  codBarra: string;
  estoque_id: number;
}

// Define o tipo para o estado formData
interface FormData {
  cliente_id: number;
  funcionario_id: number;
  QTparcelas: number;
  valorTotal: number;
  valorDesconto: number;
  valorTotalDesconto: number;
  totalPago: number;
  status: string;
  parcelas: {
    parcela: number;
    valorParcela: number;
    dataPagamento: string;
    status: string;
    venda_id: number;
    tipoPagamento: string;
  }[];
  produtos: {
    quantidade: number;
    id: number;
    nameProduto: string;
    valorUnitario: number;
  }[];
  // ItemProduto: ItemProduto[];
}

const AdicionarVendas: React.FC<AdicionarVendasProps> = ({
  open,
  onClose,
  title,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    cliente_id: 0,
    funcionario_id: 0,
    QTparcelas: 0,
    valorTotal: 0,
    valorDesconto: 0,
    valorTotalDesconto: 0,
    totalPago: 0,
    status: "pendente",
    parcelas: [
      {
        parcela: 0,
        valorParcela: 0,
        dataPagamento: "",
        status: "pendente",
        venda_id: 0,
        tipoPagamento: "",
      },
    ],
    produtos: [
    ],
    // ItemProduto: [
    // ]
  });
  const [formData2, setFormData2] = useState({
    nome: "",
    quantidade: 0,
    fornecedor_id: 0,
    categoria_id: 0,
    marca_id: 0,
    valorUnitario: 0,
  });
  const [clientes, setClientes] = useState<IListagemCliente[]>([]);
  const [funcionarios, setFuncionario] = useState<IListagemUser[]>([]);
  const [produtos, setProdutos] = useState<IDetalheEstoque[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | "">("");
  const [quantidade, setQuantidade] = useState<number>(1);
  const [abaSelecionada, setAbaSelecionada] = useState<number>(0);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    ViewCategoria[]
  >([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState<ViewMarca[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [codigoBarras, setCodigoBarras] = useState<{ [key: number]: string[] }>({});
  let isExpanded;
  const [codigosDeBarras, setCodigosDeBarras] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);


  const ConsultarClientes = async () => {
    try {
      const consultar = await ClienteService.getCliente();
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
      const consultarFuncionario = await UsersService.getUsers();
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

  // const ConsultarEstoque = async () => {
  //   try {
  //     const consultarEstoque = await EstoqueService.getAll();
  //     if (consultarEstoque instanceof Error) {
  //       console.error("Erro ao consultar estoque:", consultarEstoque.message);
  //     } else {
  //       setProdutos(consultarEstoque.filter((item) => item.quantidade > 0));
  //     }
  //   } catch (error) {
  //     console.error("Erro ao consultar estoque:", error);
  //   }
  // };

  const ConsultarCategoria = async () => {
    try {
      const consultar = await CategoriaService.consultaCategoria();
      if (consultar instanceof Error) {
        console.error("Erro ao consultar categorias:", consultar.message);
      } else {
        setCategoriaSelecionada(consultar);
      }
    } catch (error) {
      console.error("Erro ao consultar categorias:", error);
    }
  };

  const ConsultarMarca = async (id: number) => {
    try {
      const marcas = await MarcaService.consultaMarcaCategoria(id);
      if (marcas instanceof Error) {
        console.error("Erro ao consultar marcas:", marcas.message);
        setMarcaSelecionada([]);
      } else if (Array.isArray(marcas)) {
        setMarcaSelecionada(marcas);
      } else {
        setMarcaSelecionada([marcas]);
      }
    } catch (error) {
      console.error("Erro ao consultar marcas:", error);
      setMarcaSelecionada([]);
    }
  };

  const ConsultarProduto = async (id: number) => {
    try {
      const produtos = await EstoqueService.getBymarca(id);
      if (produtos instanceof Error) {
        console.error("Erro ao consultar produtos:", produtos.message);
        setProdutos([]);
      } else {
        setProdutos(produtos.filter((item) => item.quantidade > 0));
      }
    } catch (error) {
      console.error("Erro ao consultar produtos:", error);
      setProdutos([]);
    }
  };

  const calcularParcelas = () => {
    const valorTotalFinal = formData.valorTotalDesconto;
    const qtParcelas = formData.QTparcelas;
    const valorParcela = qtParcelas > 0 ? valorTotalFinal / qtParcelas : 0;
    const novasParcelas = Array.from({ length: qtParcelas }, (_, i) => ({
      parcela: i + 1,
      valorParcela: valorParcela,
      dataPagamento: formData.parcelas[i]?.dataPagamento || "",
      status: "pendente",
      venda_id: 0,
      tipoPagamento: "",
    }));

    setFormData((prevData) => ({
      ...prevData,
      parcelas: novasParcelas,
    }));
  };

  useEffect(() => {
    ConsultarClientes();
    ConsultarFuncionarios();
    const valorTotalDesconto = formData.valorTotal - formData.valorDesconto;
    setFormData((prevData) => ({
      ...prevData,
      valorTotalDesconto,
    }));

    ConsultarCategoria();
    if (formData2.categoria_id) {
      ConsultarMarca(formData2.categoria_id);
    }
    if (formData2.marca_id) {
      ConsultarProduto(formData2.marca_id);
    }
    calcularParcelas();
  }, [formData.QTparcelas, formData.valorTotal, formData.valorDesconto, formData.valorTotalDesconto, formData2.categoria_id, formData2.marca_id]);

  const handleSelectChange = (event: SelectChangeEvent<number | "">) => {
    const { name, value } = event.target;

    if (name === "produto_id") {
      setProdutoSelecionado(value as number | "");
    } else if (name === "categoria_id" || name === "marca_id") {
      setFormData2((prevData) => ({
        ...prevData,
        [name]: value !== "" ? Number(value) : 0,
      }));

      // Se categoria ou marca mudar, pode ser necessário redefinir produtos
      if (name === "categoria_id") {
        setMarcaSelecionada([]);
        setProdutos([]);
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value !== "" ? Number(value) : 0,
      }));
    }
  };


  const handleAddProduto = () => {
    const produto = produtos.find((p) => p.id === produtoSelecionado);
    if (produto) {
      const valorUnitario = produto.promocao === "ativo" && produto.valor_promocional
        ? produto.valor_promocional
        : produto.valorUnitarioVenda;

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
          produtos: [
            ...prevData.produtos,
            { id: produto.id, quantidade, nameProduto: produto.nome, valorUnitario },
          ],
        }));
      }
      atualizarValorTotal(valorUnitario * quantidade);
      setQuantidade(1);
      setProdutoSelecionado("");
      setMarcaSelecionada([]);
      setCategoriaSelecionada([]);
    }
  };


  const handleRemoveProduto = (id: number) => {
    const produto = formData.produtos.find((p) => p.id === id);
    if (produto) {
      const valorProduto =
        produto.quantidade *
        (produtos.find((p) => p.id === id)?.valorUnitarioVenda || 0);
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
      valorTotalDesconto: 0,
      totalPago: 0,
      status: "pendente",
      parcelas: [
        {
          parcela: 0,
          valorParcela: 0,
          dataPagamento: "",
          status: "pendente",
          venda_id: 0,
          tipoPagamento: "",
        },
      ],
      produtos: [],
      // ItemProduto: []

    });
  };

  const valorTotalFinal = formData.valorTotal - formData.valorDesconto;

  const handleToggleRow = (id: number) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleCodigoBarrasChange = (id: number, index: number, value: string) => {
    setCodigoBarras(prev => ({
      ...prev,
      [id]: [
        ...(prev[id] || []).slice(0, index),
        value,
        ...(prev[id] || []).slice(index + 1),
      ],
    }));
  };

  const handleAddCodigoBarras = (id: number) => {
    setCodigoBarras(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), ""],
    }));
  };

  // useEffect(() => {
  //   // Calcula o itemProduto apenas com códigos de barras não vazios
  //   const updatedItemProduto = formData.produtos.flatMap(produto =>
  //     (codigoBarras[produto.id] || [])
  //       .filter(codBarra => codBarra.trim() !== "")  // Remove códigos vazios
  //       .map(codBarra => ({
  //         codBarra,
  //         estoque_id: produto.id,
  //       }))
  //   );

  //   setFormData(prevFormData => ({
  //     ...prevFormData,
  //     ItemProduto: updatedItemProduto
  //   }));

  //   console.log('FormData atualizado:', updatedItemProduto);
  //   console.log('FormData:', formData);


  // }, [codigoBarras, formData.produtos]);


  const fetchCodigosBarras = async (idProduto: number) => {

    try {
      const consultarCodBarras = await EstoqueService.getItemProdutoList(idProduto);
      if (consultarCodBarras instanceof Error) {
        console.error(
          "Erro ao consultar CodigosBarras:",
          consultarCodBarras.message
        );
      } else {

        const codBarras = consultarCodBarras
        .filter((dados) => dados.status === "disponivel") 
        .map((dados) => dados.codBarras);

        setCodigosDeBarras(codBarras);
      }
    } catch (error) {
      console.error("Erro ao consultar CodigosBarras:", error);

    }
  }

  const TratamentoErro = () => {
    // Verifica se o cliente_id está preenchido
    if (!formData.cliente_id) {
      return 'Por favor, selecione o cliente';
    }
  
    // Verifica se o funcionario_id está preenchido
    if (!formData.funcionario_id) {
      return 'Por favor, selecione o funcionário';
    }
  
    // Verifica se QTparcelas é maior que 0
    if (formData.QTparcelas <= 0) {
      return 'Por favor, defina a quantidade de parcelas';
    }
  
    // Verifica se valorTotal é maior que 0
    if (formData.valorTotal <= 0) {
      return 'O valor total deve ser maior que 0';
    }
  
    // Verifica se valorDesconto é um número válido
    if (isNaN(formData.valorDesconto)) {
      return 'O valor do desconto deve ser um número válido';
    }
  
    // Verifica se valorTotalDesconto é um número válido
    if (isNaN(formData.valorTotalDesconto)) {
      return 'O valor total com desconto deve ser um número válido';
    }
  
    // Verifica se totalPago é um número válido
    if (isNaN(formData.totalPago)) {
      return 'O total pago deve ser um número válido';
    }
  
    // Verifica se há pelo menos um item em parcelas
    if (formData.parcelas.length === 0) {
      return 'Adicione pelo menos uma parcela';
    }
  
    // Verifica se todos os itens em parcelas estão preenchidos corretamente
    for (const parcela of formData.parcelas) {
      if (!parcela.dataPagamento) {
        return 'Por favor, informe a data de pagamento para todas as parcelas';
      }
      if (parcela.valorParcela <= 0) {
        return 'O valor da parcela deve ser maior que 0';
      }
    }
  
    // Verifica se há pelo menos um produto
    if (formData.produtos.length === 0) {
      return 'Adicione pelo menos um produto';
    }
  
    // Verifica se todos os produtos estão preenchidos corretamente
    for (const produto of formData.produtos) {
      if (produto.quantidade <= 0) {
        return 'A quantidade do produto deve ser maior que 0';
      }
      if (!produto.id) {
        return 'O ID do produto é obrigatório';
      }
      if (produto.valorUnitario <= 0) {
        return 'O valor unitário do produto deve ser maior que 0';
      }
    }
  
    // let totalCodBarras = 0;
    // formData.produtos.forEach(produto => {
    //   const quantidadeCodBarras = (codigoBarras[produto.id] || []).length;
    //   if (quantidadeCodBarras < produto.quantidade) {
    //     totalCodBarras += produto.quantidade;
    //   }
    // });
  
    // const totalCodBarrasPreenchidos = Object.values(codigoBarras).flat().filter(codBarra => codBarra.trim() !== "").length;
  
    // if (totalCodBarrasPreenchidos < totalCodBarras) {
    //   return 'A quantidade total de códigos de barras preenchidos não corresponde à quantidade de produtos';
    // }
  
    // // Verifica se todos os itens do ItemProduto estão preenchidos corretamente
    // for (const item of formData.ItemProduto) {
    //   if (!item.codBarra) {
    //     return 'O código de barras é obrigatório para todos os itens de produto';
    //   }
    //   if (item.estoque_id <= 0) {
    //     return 'O ID do estoque deve ser maior que 0 para todos os itens de produto';
    //   }
    // }
    return null;
  }
  

  const handleSubmit = async () => {
    const erro = TratamentoErro();
    if (erro) {
      alert(erro);
      return; 
    }
  
    try {
      onSubmit(formData);
      onClose();
      setTimeout(() => {
        resetForm();
      }, 5000); 
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
    }
  };

  const Orcamento = (venda: VendaType) => {
    generatePDFOrcamento(venda);
  }


  const gerPdf = async () => {
    const erro = TratamentoErro();
    if (erro) {
      alert(erro);
      return; 
    }
  
    try {
      Orcamento(formData);
      // onClose();
      setTimeout(() => {
        resetForm();
      }, 5000); 
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
    }
  };
  
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
                    required
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
            </Grid>
          )}
          {abaSelecionada === 1 && (
            <Box>
              <Grid container spacing={2} sx={{ alignItems: "center" }}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="categoria-label">Categoria</InputLabel>
                    <Select
                      labelId="categoria-label"
                      name="categoria_id"
                      value={formData2.categoria_id}
                      onChange={handleSelectChange}
                      displayEmpty
                    >
                      {categoriaSelecionada.map((categoria) => (
                        <MenuItem key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="marca-label">Marca</InputLabel>
                    <Select
                      labelId="marca-label"
                      name="marca_id"
                      value={formData2.marca_id || ""}
                      onChange={handleSelectChange}
                      displayEmpty
                    >
                      {marcaSelecionada.length > 0 ? (
                        marcaSelecionada.map((marca) => (
                          <MenuItem key={marca.id} value={marca.id}>
                            {marca.nome}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>Nenhuma marca disponível</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                </Grid>
                <Grid item xs={12} sm={3.5}>
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
                          {produto.nome} - R$ {produto.valorUnitarioVenda.toFixed(2)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={1.6}>
                  <TextField
                    type="number"
                    label="Qt"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={0.5}>
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
                      <TableCell sx={{ p: 1.8, paddingLeft: "8px" }}>
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
                      const detalheProduto = produtos.find((p) => p.id === produto.id);
                      const valorUnitario = detalheProduto?.promocao === "ativo" && detalheProduto?.valor_promocional
                        ? detalheProduto.valor_promocional
                        : detalheProduto?.valorUnitarioVenda;

                      const valorTotal = (valorUnitario || 0) * produto.quantidade;
                      const isExpanded = expandedRows.includes(produto.id);

                      return (
                        <React.Fragment key={index}>

                          <TableRow key={index}>
                            <TableCell sx={{ p: 0.1, paddingLeft: "8px" }}>
                              {produto.nameProduto}
                            </TableCell>
                            <TableCell sx={{ p: 0.1 }}>
                              {produto.quantidade}
                            </TableCell>
                            <TableCell sx={{ p: 0.1 }}>
                              R$ {valorUnitario?.toFixed(2)}
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
                            {/* <TableCell sx={{ p: 0.1 }}>
                              <Button
                                onClick={() => handleToggleRow(produto.id)}
                              >
                                {isExpanded ? "Fechar" : "Abrir"}
                              </Button>
                            </TableCell> */}
                          </TableRow>

                          {
                          // isExpanded && (
                          //   <TableRow>
                          //     <TableCell colSpan={6}>
                          //       <Box>
                          //         {Array.from({ length: produto.quantidade }).map((_, i) => (
                          //           <Box key={i} sx={{ mb: 0.6 }}>
                          //             {/* <TextField
                          //               label={`Código de Barras ${i + 1}`}
                          //               value={codigoBarras[produto.id]?.[i] || ""}
                          //               onChange={(e) =>
                          //                 handleCodigoBarrasChange(produto.id, i, e.target.value)
                          //               }
                          //               fullWidth
                          //             /> */}
                          //             <Autocomplete
                          //               options={codigosDeBarras} 
                          //               getOptionLabel={(option) => option || ""} 
                          //               value={codigoBarras[produto.id]?.[i] || ""} 
                          //               onChange={(e, newValue) => {
                          //                 if (newValue) {
                          //                   handleCodigoBarrasChange(produto.id, i, newValue);
                          //                 }
                          //               }}
                          //               onOpen={() => fetchCodigosBarras(produto.id)}
                          //               loading={loading}
                          //               renderInput={(params) => (
                          //                 <TextField
                          //                   {...params}
                          //                   label={`Código de Barras ${i + 1}`}
                          //                   fullWidth
                          //                   InputProps={{
                          //                     ...params.InputProps,
                          //                     endAdornment: (
                          //                       <>
                          //                         {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          //                         {params.InputProps.endAdornment}
                          //                       </>
                          //                     ),
                          //                   }}
                          //                 />
                          //               )}
                          //             />

                          //           </Box>
                          //         ))}
                          //         <Button
                          //           variant="outlined"
                          //           onClick={() => handleAddCodigoBarras(produto.id)}
                          //         >
                          //           Adicionar Código de Barras
                          //         </Button>
                          //       </Box>
                          //     </TableCell>
                          //   </TableRow>
                          // )
                          }
                        </React.Fragment>
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
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="number"
                    label="Quantidade de parcelas"
                    value={formData.QTparcelas}
                    onChange={(e) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        QTparcelas: Number(e.target.value),
                      }));
                    }}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
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
              <TableContainer
                component={Paper}
                sx={{ mt: 1, maxHeight: "300px", overflowY: "auto" }}
              >
                <Table>
                  <TableHead sx={{ backgroundColor: "#F0F0F0" }}>
                    <TableRow>
                      <TableCell sx={{ p: 1, width: "20%" }}>Parcela</TableCell>
                      <TableCell sx={{ p: 1, width: "20%" }}>
                        Valor Parcela
                      </TableCell>
                      <TableCell sx={{ p: 1, width: "20%" }}>
                        Data Pagamento
                      </TableCell>
                      <TableCell sx={{ p: 1, width: "20%" }}>
                        Tipo Pagamento
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ backgroundColor: "#fafafa" }}>
                    {formData.parcelas.map((parcela, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ p: 1, width: "20%" }}>
                          {parcela.parcela}
                        </TableCell>
                        <TableCell sx={{ p: 1, width: "20%" }}>
                          R$ {parcela.valorParcela.toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ p: 1, width: "20%" }}>
                          <TextField
                            type="date"
                            value={parcela.dataPagamento}
                            onChange={(e) => {
                              const novaDataPagamento = e.target.value;
                              setFormData((prevData) => ({
                                ...prevData,
                                parcelas: prevData.parcelas.map((p, i) =>
                                  i === index
                                    ? { ...p, dataPagamento: novaDataPagamento }
                                    : p
                                ),
                              }));
                            }}
                            size="small"
                            sx={{
                              width: "100%",
                              padding: "2px",
                              fontSize: "0.875rem",
                            }}
                            margin="none"
                          />
                        </TableCell>
                        <TableCell sx={{ p: 1, width: "20%" }}>
                          <FormControl fullWidth margin="none">
                            <InputLabel id={`tipoPagamento-label-${index}`}>
                              Tipo Pagamento
                            </InputLabel>
                            <Select
                              labelId={`tipoPagamento-label-${index}`}
                              name={`tipoPagamento-${index}`}
                              value={parcela.tipoPagamento}
                              onChange={(e) => {
                                const novoTipoPagamento = e.target.value;
                                setFormData((prevData) => ({
                                  ...prevData,
                                  parcelas: prevData.parcelas.map((p, i) =>
                                    i === index
                                      ? {
                                        ...p,
                                        tipoPagamento: novoTipoPagamento,
                                      }
                                      : p
                                  ),
                                }));
                              }}
                              size="small"
                            >
                              <MenuItem value="dinheiro">Dinheiro</MenuItem>
                              <MenuItem value="cartao">Cartão</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Bloco para Valores Totais */}
          <Box sx={{ textAlign: "right", paddingTop: 2, paddingBottom: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Valor Total (sem desconto): R$ {formData.valorTotal.toFixed(2)}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Desconto: R$ {formData.valorDesconto.toFixed(2)}
            </Typography>
            <Typography variant="h6">
              Total: R$ {valorTotalFinal.toFixed(2)}
            </Typography>
          </Box>

          <Grid container spacing={1} mt={1}>
            <Grid item xs={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {handleSubmit()

                }}
                fullWidth
              >
                Efetuar venda
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {gerPdf()

                }}
                fullWidth
              >
                Gerar Orçamento
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
