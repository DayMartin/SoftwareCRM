// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Button,
//   Modal,
//   Typography,
//   TextField,
//   Grid,
// } from "@mui/material";
// import { ItemProduto } from "../../../shared/services/api/Compra/CompraService";

// interface CodBarraModalProps {
//   open: boolean;
//   onClose: () => void;
//   quantidade: number;
//   estoque_id: number;
//   onSave: (itemData: ItemProduto[]) => void;
// }

// const CodBarraModal: React.FC<CodBarraModalProps> = ({
//   open,
//   onClose,
//   quantidade,
//   estoque_id,
//   onSave,
// }) => {
//   const [itemData, setItemData] = useState<ItemProduto[]>(
//     Array(quantidade).fill({ codBarras: "", estoque_id: estoque_id })
//   );

//   const [localQuantidade, setLocalQuantidade] = React.useState(quantidade);

//   // Atualiza o estado local quando a quantidade prop muda
//   React.useEffect(() => {
//     setLocalQuantidade(quantidade);
//   }, [quantidade]);

//   const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setLocalQuantidade(Number(event.target.value));
//   };


// return (
//     <Modal open={open} onClose={onClose}>
//       <div style={{ padding: 20, maxWidth: 500, margin: 'auto', backgroundColor: 'white', borderRadius: 8 }}>
//         <Typography variant="h6">Adicionar Código de Barra</Typography>
//         <Typography variant="subtitle1">Estoque ID: {estoque_id}</Typography>
//         <TextField
//           type="number"
//           label="Quantidade"
//           value={localQuantidade}
//           onChange={handleQuantityChange}
//           fullWidth
//           margin="normal"
//         />
//         <Button variant="contained" color="primary"  style={{ marginRight: 10 }}>
//           Salvar
//         </Button>
//         <Button variant="outlined" onClick={onClose}>
//           Fechar
//         </Button>
//       </div>
//     </Modal>
//   );
// };

// export default CodBarraModal;
