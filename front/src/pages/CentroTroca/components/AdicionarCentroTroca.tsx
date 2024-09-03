import React, { useState } from "react";
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
  SelectChangeEvent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

interface AdicionarCentroTrocaProps {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (data: any) => void;
}

const AdicionarCentroTroca: React.FC<AdicionarCentroTrocaProps> = ({
  open,
  onClose,
  title,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    venda_id: '',
    compra_id: '',
    estoque_id: '',
    item_antigo_codBarra: '',
    item_novo_codBarra: '', 
    motivo: '', 
    descricaoTroca: '',
    fornecedor_id: ''
  });

  const [showPopup, setShowPopup] = useState(false);
  const [responseUser, setResponseUser] = useState<boolean | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (value === 'defeito') {
      setShowPopup(true);
    }
  };

  const handlePopupClose = (response: boolean) => {
    setResponseUser(response);
    setShowPopup(false);
  };

  const handleSubmit = () => {
    // Se o motivo for 'defeito' e a resposta do usuário ainda não foi definida, não envie o formulário
    if (formData.motivo === 'defeito' && responseUser === null) {
      return;
    }

    // Adicionar responseUser ao formData se estiver definido
    const submitData = {
      ...formData,
      responseUser
    };

    // Execute a lógica para envio de dados aqui
    onSubmit(submitData);
    resetForm(); // Resetar o formulário
    onClose();
  };

  const resetForm = () => {
    setFormData({
      venda_id: '',
      compra_id: '',
      estoque_id: '',
      item_antigo_codBarra: '',
      item_novo_codBarra: '', 
      motivo: '', 
      descricaoTroca: '',
      fornecedor_id: ''
    });
    setResponseUser(null); // Resetar resposta do usuário
  };

  return (
    <>
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
              <Grid item xs={12} sm={4}>
                <TextField
                  name="venda_id"
                  label="Venda"
                  value={formData.venda_id}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="compra_id"
                  label="Compra"
                  value={formData.compra_id}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="estoque_id"
                  label="Produto"
                  value={formData.estoque_id}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="item_antigo_codBarra"
                  label="codBarra antiga"
                  value={formData.item_antigo_codBarra}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="item_novo_codBarra"
                  label="codBarra Nova"
                  value={formData.item_novo_codBarra}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  name="descricaoTroca"
                  label="Descrição"
                  value={formData.descricaoTroca}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="fornecedor_id"
                  label="Fornecedor"
                  value={formData.fornecedor_id}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="motivo-label">Motivo</InputLabel>
                  <Select
                    labelId="motivo-label"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleSelectChange}
                    label="Motivo"
                  >
                    <MenuItem value="defeito">Defeito</MenuItem>
                    <MenuItem value="troca">Troca</MenuItem>
                    <MenuItem value="erroDePedido">Erro de Pedido</MenuItem>
                    <MenuItem value="outro">Outro</MenuItem>
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

      {/* Popup para confirmação */}
      <Dialog open={showPopup} onClose={() => handlePopupClose(false)}>
        <DialogTitle>Confirmar Envio</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Deseja enviar a solicitação de troca para o fornecedor?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlePopupClose(false)}>Não</Button>
          <Button onClick={() => handlePopupClose(true)} autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdicionarCentroTroca;
