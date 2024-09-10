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
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import {
  CategoriaService,
  ViewCategoria,
} from "../../../shared/services/api/Estoque/CategoriaService";
import {
  MarcaService,
  ViewMarca,
} from "../../../shared/services/api/Estoque/MarcaService";
import { FornecedorService, IListagemFornecedor } from "../../../shared/services/api/Fornecedor/FornecedorService";

interface AdicionarEstoqueProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (formData: any, imagem: File | null) => void;
}

const AdicionarEstoque: React.FC<AdicionarEstoqueProps> = ({
  open,
  onClose,
  title,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    nome: "",
    quantidade: 0,
    fornecedor_id: 0,
    categoria_id: 0,
    marca_id: "",
    valorUnitarioCompra: 0,
    valorUnitarioVenda: 0,
    promocao: "",
    valor_promocional: 0
  });
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<IListagemFornecedor[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<ViewCategoria[]>([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState<ViewMarca[]>([]);
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (imagem) {
      onSubmit(formData, imagem); // Aqui passamos formData e imagem como dois argumentos
      resetForm(); // Resetar o formulário
      onClose();
    } else {
      alert("Por favor, adicione uma imagem.");
    }
  };

  const ConsultarFornecedor = async () => {
    try {
      const consultar = await FornecedorService.getFornecedor();
      if (consultar instanceof Error) {
        console.error("Erro ao consultar fornecedores:", consultar.message);
      } else {
        setFornecedorSelecionado(
          consultar.filter((item) => item.status === "ativo")
        );
      }
    } catch (error) {
      console.error("Erro ao consultar fornecedores:", error);
    }
  };

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
      console.log("Marcas retornadas:", marcas);
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

  useEffect(() => {
    ConsultarFornecedor();
    ConsultarCategoria();
    if (formData.categoria_id) {
      ConsultarMarca(formData.categoria_id);
    }
  }, [formData.categoria_id]);

  const handleInputChange = (event: SelectChangeEvent<number | "">) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      quantidade: 0,
      fornecedor_id: 0,
      categoria_id: 0,
      valorUnitarioCompra: 0,
      valorUnitarioVenda: 0,
      marca_id: "",
      promocao: "",
      valor_promocional: 0
    });
    setImagem(null);
    setImagemPreview(null);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
          width: "80%",
          maxHeight: "90vh",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          overflow: "auto",
        }}
      >
        <Typography variant="h6" component="h2" mb={2}>
          {title}
        </Typography>
        <Box component="form">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: 16, width: '100%' }}
              />
              {imagemPreview && (
                <Box mt={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={imagemPreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', height: 'auto', borderRadius: 4, border: '1px solid #ddd' }}
                  />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={8}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="nome"
                    label="Nome"
                    value={formData.nome}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="valorUnitarioCompra"
                    label="Valor Unitário Compra"
                    value={formData.valorUnitarioCompra}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="valorUnitarioVenda"
                    label="Valor Unitário Venda"
                    value={formData.valorUnitarioVenda}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="fornecedor-label">Fornecedor</InputLabel>
                    <Select
                      labelId="fornecedor-label"
                      name="fornecedor_id"
                      value={formData.fornecedor_id}
                      onChange={handleInputChange}
                      displayEmpty
                    >
                      {fornecedorSelecionado.map((fornecedor) => (
                        <MenuItem key={fornecedor.id} value={fornecedor.id}>
                          {fornecedor.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="categoria-label">Categoria</InputLabel>
                    <Select
                      labelId="categoria-label"
                      name="categoria_id"
                      value={formData.categoria_id}
                      onChange={handleInputChange}
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
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="marca-label">Marca</InputLabel>
                    <Select
                      labelId="marca-label"
                      name="marca_id"
                      value={formData.marca_id}
                      onChange={handleSelectChange}
                      displayEmpty
                    >
                      {marcaSelecionada.map((marca) => (
                        <MenuItem key={marca.id} value={marca.id}>
                          {marca.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="quantidade"
                    label="Quantidade"
                    type="number"
                    value={formData.quantidade}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="promocao"
                    label="Promoção"
                    value={formData.promocao}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="valor_promocional"
                    label="Valor Promocional"
                    value={formData.valor_promocional}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mr: 2 }}>
              Salvar
            </Button>
            <Button onClick={onClose} variant="outlined" color="secondary">
              Fechar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AdicionarEstoque;
