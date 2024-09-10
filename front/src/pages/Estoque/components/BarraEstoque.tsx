import { Box, Button } from "@mui/material";
import * as React from "react";
import { useNavigate } from 'react-router-dom';
import AdicionarEstoque from "./AdicionarEstoque";
import { EstoqueService } from "../../../shared/services/api/Estoque/EstoqueService";
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface BarraEstoqueProps {
    listar: () => void
}

export const BarraEstoque: React.FC<BarraEstoqueProps> = ({
    listar
}) => {
    const navigate = useNavigate();
    const [openEstoque, setOpenEstoque] = React.useState(false);

    const handleOpenEstoque = () => setOpenEstoque(true);
    const handleCloseEstoque = () => setOpenEstoque(false);
    const [imagem, setImagem] = React.useState<File | null>(null);

    const handleSubmit = async (formData: any, imagem: File | null) => {
        if (imagem) {
          try {
            await EstoqueService.create(formData, imagem);  // Passando `formData` e `imagem`
            alert('Produto criado com sucesso!');
            listar();
            handleCloseEstoque();
          } catch (error) {
            console.error(error);
            alert('Erro ao criar o produto');
          }
        } else {
          alert('Imagem é obrigatória.');
        }
      };

      // Lidar com a mudança da imagem
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImagem(event.target.files[0]);
    }
  };


    return (
        <Box
            sx={{
                m: 1,
                width: "auto",
                height: '30px',
                marginLeft: "8%",
                marginRight: "2%",
                padding: '2%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                borderRadius: '8px'
            }}
        >
            <Button
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '28px',
                    transform: 'translateY(-50%)',
                    backgroundColor: '#0d47a1',
                    color: 'white',
                    borderRadius: '6%',
                    width: '10%',
                    minWidth: '10%',
                    height: 28,
                    fontSize: 10,
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                        backgroundColor: '#0b3d91',
                    },
                }}
                onClick={handleOpenEstoque}
            >
                Novo produto
            </Button>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 'auto',
                }}
            >

                <Button
                    sx={{
                        backgroundColor: '#0d47a1',
                        color: 'white',
                        borderRadius: '6%',
                        width: 'auto',
                        minWidth: 120,
                        height: 28,
                        margin: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 'bold',
                        alignItems: 'center',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                            backgroundColor: '#0b3d91',
                        },
                        mr: 1,
                    }}
                >
                    Solicitação de compra
                </Button>
                <Button
                    sx={{
                        backgroundColor: '#0d47a1',
                        color: 'white',
                        borderRadius: '6%',
                        width: 'auto',
                        minWidth: 120,
                        margin: '5px',
                        height: 28,
                        display: 'flex',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 'bold',
                        alignItems: 'center',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                            backgroundColor: '#0b3d91',
                        },
                    }}
                    onClick={() => navigate('/receber')}                >
                    <LocalPrintshopIcon />
                </Button>

                <Button
                    sx={{
                        backgroundColor: '#0d47a1',
                        color: 'white',
                        borderRadius: '6%',
                        width: 'auto',
                        minWidth: 120,
                        margin: '5px',
                        height: 28,
                        display: 'flex',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 'bold',
                        alignItems: 'center',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                            backgroundColor: '#0b3d91',
                        },
                    }}
                    onClick={() => navigate('/receber')}                >
                    <FilterAltIcon />
                </Button>
            </Box>


            {/* Modal para adicionar novo produto */}
            <AdicionarEstoque open={openEstoque} onClose={handleCloseEstoque} title="Novo produto" onSubmit={handleSubmit} />

        </Box>
    );
};
