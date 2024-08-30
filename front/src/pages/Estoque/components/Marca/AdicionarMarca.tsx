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
import { ViewCategoria } from "../../../../shared/services/api/Estoque/EstoqueService";
import { CategoriaService } from "../../../../shared/services/api/Estoque/CategoriaService"; 

interface AdicionarMarcaProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: any) => void;
}

const AdicionarMarca: React.FC<AdicionarMarcaProps> = ({
  open,
  onClose,
  title,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    nome: "",
    categoria_id: 0
  });
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

  const resetForm = () => {
    setFormData({
      nome: "",
      categoria_id: 0
    });
  };

  useEffect(() => {
    ConsultarCategoria();
  }, [formData.categoria_id]);

  const handleSelectChange = (event: SelectChangeEvent<number | "">) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value !== "" ? Number(value) : "",
    }));
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
          position: 'relative',
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
              <FormControl fullWidth margin="normal">
                <InputLabel id="categoria-label">Categoria</InputLabel>
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

export default AdicionarMarca;
