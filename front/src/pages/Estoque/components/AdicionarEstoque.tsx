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
import { IListagemCliente, UsersService } from "../../../shared/services";
import {
  EstoqueService,
  ViewCategoria,
} from "../../../shared/services/api/Estoque/EstoqueService";

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
    valorUnitario: 0,
  });
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<
    IListagemCliente[]
  >([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    ViewCategoria[]
  >([]);

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
      const consultar = await UsersService.getClientes("fornecedor");
      if (consultar instanceof Error) {
        console.error("Erro ao consultar clientes:", consultar.message);
      } else {
        setFornecedorSelecionado(
          consultar.filter((item) => item.status === "ativo")
        );
      }
    } catch (error) {
      console.error("Erro ao consultar clientes:", error);
    }
  };

  const ConsultarCategoria = async () => {
    try {
      const consultar = await EstoqueService.consultaCategoria();
      if (consultar instanceof Error) {
        console.error("Erro ao consultar categorias:", consultar.message);
      } else {
        setCategoriaSelecionada(consultar);
      }
    } catch (error) {
      console.error("Erro ao consultar categorias:", error);
    }
  };

  useEffect(() => {
    ConsultarFornecedor();
    ConsultarCategoria();
  }, []);

  const handleSelectChange = (event: SelectChangeEvent<number | "">) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value as number,
    }));
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      quantidade: 0,
      fornecedor_id: 0,
      categoria_id: 0,
      valorUnitario: 0,
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
          width: 600,
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
                name="valorUnitario"
                label="Valor Unitário"
                value={formData.valorUnitario}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            {/* Select para Tipo */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="fornecedor-label">Fornecedor</InputLabel>
                <Select
                  labelId="fornecedor-label"
                  name="fornecedor_id"
                  value={formData.fornecedor_id}
                  onChange={handleSelectChange}
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
                <InputLabel id="fornecedor-label">Categoria</InputLabel>
                <Select
                  labelId="categoria-label"
                  name="categoria_id"
                  value={formData.categoria_id}
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
