import { Box, Button } from "@mui/material";
import * as React from "react";
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import AdicionarEstoque from "./AdicionarEstoque";
import { EstoqueService } from "../../../shared/services/api/Estoque/EstoqueService";
import { CategoriaService } from "../../../shared/services/api/Estoque/CategoriaService";
import AdicionarCategoria from "./AdicionarCategoria";
import { MarcaService } from "../../../shared/services/api/Estoque/MarcaService";
import AdicionarMarca from "./AdicionarMarca";

export const BarraEstoque: React.VFC = () => {
    const navigate = useNavigate();
    const [openEstoque, setOpenEstoque] = React.useState(false);
    const [openCategoria, setOpenCategoria] = React.useState(false);
    const [openMarca, setOpenMarca] = React.useState(false);


    const handleOpenEstoque = () => setOpenEstoque(true);
    const handleCloseEstoque = () => setOpenEstoque(false);

    const handleOpenCategoria = () => setOpenCategoria(true);
    const handleCloseCategoria = () => setOpenCategoria(false);

    const handleOpenMarca = () => setOpenMarca(true);
    const handleCloseMarca = () => setOpenMarca(false);

    const handleSubmit = async (formData: any) => {
        try {
            await EstoqueService.create(formData);
            alert('Produto criado com sucesso!');
            handleCloseEstoque();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar Venda');
        }
    };

    const handleSubmitCategoria = async (formData: any) => {
        try {
            await CategoriaService.createCategoria(formData);
            alert('Categoria criada com sucesso!');
            handleCloseCategoria();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar categoria');
        }
    };

    const handleSubmitMarca = async (formData: any) => {
        try {
            await MarcaService.createMarca(formData);
            alert('Marca criada com sucesso!');
            handleCloseMarca();
        } catch (error) {
            console.error(error);
            alert('Erro ao criar Marca');
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
                    display: 'flex', // Adiciona flex para alinhar os botões horizontalmente
                    alignItems: 'center',
                    ml: 'auto',  // Move o grupo de botões para o lado direito
                }}
            >
                <Button
                    sx={{
                        backgroundColor: '#0d47a1',
                        color: 'white',
                        borderRadius: '6%',
                        width: 'auto',  // Ajusta a largura do botão conforme o conteúdo
                        minWidth: 120,  // Ajusta a largura mínima do botão
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
                        mr: 1,  // Margem à direita para espaçamento entre os botões
                    }}
                    onClick={handleOpenCategoria}
                >
                    Nova Categoria
                </Button>

                <Button
                    sx={{
                        backgroundColor: '#0d47a1',
                        color: 'white',
                        borderRadius: '6%',
                        width: 'auto',  // Ajusta a largura do botão conforme o conteúdo
                        minWidth: 120,  // Ajusta a largura mínima do botão
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
                    onClick={handleOpenMarca}
                >
                    Nova Marca
                </Button>
            </Box>


            {/* Modal para adicionar nova venda */}
            <AdicionarEstoque open={openEstoque} onClose={handleCloseEstoque} title="Novo produto" onSubmit={handleSubmit} />

            {/* Modal para adicionar nova categoria */}
            <AdicionarCategoria open={openCategoria} onClose={handleCloseCategoria} title="Nova categoria" onSubmit={handleSubmitCategoria} />

            {/* Modal para adicionar nova Marca */}
            <AdicionarMarca open={openMarca} onClose={handleCloseMarca} title="Nova Marca" onSubmit={handleSubmitMarca} />

        </Box>
    );
};
