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
import { IListagemUser, UsersService } from "../../../shared/services";
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
  onSubmit: (data: any) => void;
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
    marca_id: 0,
    valorUnitario: 0,
    promocao: "",
    valor_promocional: 0
  });
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<
    IListagemFornecedor[]
  >([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    ViewCategoria[]
  >([]);
  const [marcaSelecionada, setMarcaSelecionada] = useState<ViewMarca[]>([]);

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
    onSubmit(formData);
    resetForm(); // Resetar o formulário
    onClose();
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
      valorUnitario: 0,
      marca_id: 0,
      promocao: "",
      valor_promocional: 0
    });
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
          width: "60%",
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Box component="form" sx={{ mt: 2 }}>
          {/* Grid para Inputs */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                name="nome"
                label="Nome"
                value={formData.nome}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                name="valorUnitario"
                label="Valor Unitário"
                value={formData.valorUnitario}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            {/* Select para Tipo */}
            <Grid item xs={12} sm={4}>
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
                  value={formData.marca_id || ""}
                  onChange={handleInputChange}
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="promocao">Promoção</InputLabel>
                <Select
                  labelId="promocao"
                  name="promocao"
                  value={formData.promocao}
                  onChange={handleSelectChange}
                  label="Promoção"
                >
                  <MenuItem value="ativo">Ativo</MenuItem>
                  <MenuItem value="inativo">Inativo</MenuItem>
                </Select>
              </FormControl>
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
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AdicionarEstoque;
