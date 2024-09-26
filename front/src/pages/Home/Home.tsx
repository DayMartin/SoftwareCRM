import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { VendasService } from "../../shared/services/api/Vendas/VendasService";
import { EstoqueService, resultadoGrafico } from "../../shared/services/api/Estoque/EstoqueService";
import { ClienteService } from "../../shared/services/api/Cliente/ClienteService";
import { ParcelasService } from "../../shared/services/api/Vendas/ParcelasVendaService";
import { ParcelasCompraService } from "../../shared/services/api/Compra/ParcelasCompraService";

// Registrar os componentes do Chart.js que serão usados
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

export const Home = () => {
  const [totalMes, setTotalMes] = useState(0);
  const [totalDia, setTotalDia] = useState(0);
  const [totalEstoque, setTotalEstoque] = useState(0);
  const [totalCliente, setTotalCliente] = useState(0);

  const [totaltotalMesAtual, setTotaltotalMesAtual] = useState(0);
  const [totaltotalMesPassado, setTotaltotalMesPassado] = useState(0);
  const [totaldiferenca, setTotaldiferenca] = useState(0);
  const [totalporcentagem, setTotalporcentagem] = useState(0);
  const [receberHoje, setReceberHoje] = useState(0);
  const [pagarHoje, setPagarHoje] = useState(0);
  const [grafico, setGrafico] = useState<resultadoGrafico[]>([]);
  const [dadosProdutos, setDadosProdutos] = useState<resultadoGrafico[]>([]);

  useEffect(() => {
    consultarMes();
    consultarDia();
    consultarTotalEstoque();
    consultarTotalCliente();
    consultarCompare();
    consultarReceberHoje();
    consultarPagarHoje();
    graficoConsulta();
  }, []);

  const consultarMes = async () => {
    try {
      const resultado = await VendasService.getAllMes();
      if (!(resultado instanceof Error)) {
        setTotalMes(resultado.total);
      }
    } catch (error) {
      console.error("Erro ao consultar mês", error);
    }
  };

  const consultarDia = async () => {
    try {
      const resultado = await VendasService.getAllDia();
      if (!(resultado instanceof Error)) {
        setTotalDia(resultado.total);
      }
    } catch (error) {
      console.error("Erro ao consultar dia", error);
    }
  };

  const consultarTotalEstoque = async () => {
    try {
      const resultado = await EstoqueService.getAll();
      if (!(resultado instanceof Error)) {
        setTotalEstoque(resultado.total);
      }
    } catch (error) {
      console.error("Erro ao consultar estoque", error);
    }
  };

  const consultarTotalCliente = async () => {
    try {
      const resultado = await ClienteService.getClientes();
      if (!(resultado instanceof Error)) {
        setTotalCliente(resultado.total);
      }
    } catch (error) {
      console.error("Erro ao consultar clientes", error);
    }
  };

  const consultarCompare = async () => {
    try {
      const resultado = await VendasService.getCompare();
      if (!(resultado instanceof Error)) {
        setTotaltotalMesAtual(resultado.totalMesAtual);
        setTotaltotalMesPassado(resultado.totalMesPassado);
        setTotaldiferenca(resultado.diferenca);
        setTotalporcentagem(resultado.porcentagem);
      }
    } catch (error) {
      console.error("Erro ao consultar vendas comparativas", error);
    }
  };

  const consultarReceberHoje = async () => {
    const hoje = Number(new Date())
    try {
      const resultado = await ParcelasService.diaPagamentoVendas(hoje);
      if (!(resultado instanceof Error)) {
        setReceberHoje(resultado.total);
      }
    } catch (error) {
      console.error("Erro ao consultar a receber hoje", error);
    }
  };

  const consultarPagarHoje = async () => {
    const hoje = Number(new Date())
    try {
      const resultado = await ParcelasCompraService.diaPagamentoCompras(hoje);
      if (!(resultado instanceof Error)) {
        setPagarHoje(resultado.total);
      }
    } catch (error) {
      console.error("Erro ao consultar a receber hoje", error);
    }
  };

  const graficoConsulta = async () => {
    try {
      const resultado = await EstoqueService.grafico();
      if (!(resultado instanceof Error)) {
        setGrafico(resultado.resultado);
        setDadosProdutos(resultado.resultado);
      }
    } catch (error) {
      console.error("Erro ao consultar a receber hoje", error);
    }
  };

  // Dados para o gráfico de barras de produtos
  const barDataProdutos = {
    labels: grafico.map(item => item.produto), // Nomes dos produtos
    datasets: [
      {
        label: 'Quantidade Vendida',
        data: grafico.map(item => item.totalVendido), // Quantidade vendida por produto
        backgroundColor: '#36A2EB',
      },
    ],
  };

  if (!grafico) {
    return <div>Carregando...</div>;
  }

  const cardStyles = {
    minWidth: 100,
    boxShadow: "none",
    borderRadius: 4,
    textAlign: "left",
    color: "#0002DB2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  };

  const renderCard = (title: string, value: number, color: string) => (
    <Card sx={{ ...cardStyles, backgroundColor: color }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: '12px' }}>
          {title}
        </Typography>
        <Typography variant="h4" color="primary" sx={{ fontSize: '20px', marginTop: '5px' }}>
          {value}
        </Typography>

      </CardContent>
    </Card>
  );

  // Dados e opções do gráfico de barras
  const barData = {
    labels: ['Mês Passado', 'Mês Atual'],
    datasets: [
      {
        label: 'Vendas',
        data: [totaltotalMesPassado, totaltotalMesAtual],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Vendas por Mês (Barras)',
      },
    },
  };

  // Dados e opções do gráfico de pizza
  const pieData = {
    labels: ['Mês Passado', 'Mês Atual'],
    datasets: [
      {
        label: 'Vendas por Mês',
        data: [totaltotalMesPassado, totaltotalMesAtual],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Distribuição das Vendas por Mês (Pizza)',
      },
    },
  };

  const barOptionsProdutos = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Produtos e Quantidades Vendidas',
      },
    },
  };

  
    // Renderizando a tabela
    const renderTabelaProdutos = () => (
      <TableContainer component={Paper} sx={{ width: '100%', maxHeight: 'auto', overflowY: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell>Qt Vendida</TableCell>
              <TableCell>Qt estoque</TableCell>
              <TableCell>Última venda</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dadosProdutos.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.produto}</TableCell>
                <TableCell>{item.totalVendido}</TableCell>
                <TableCell>{item.totalEmEstoque}</TableCell>
                <TableCell>{item.ultimaVenda}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    

  return (
    <Box sx={{ p: 2 }}>
      {/* Primeiro Box para os dois TableContainers */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 2 }}>
        <TableContainer component={Paper} sx={{ width: '50%', height: 'auto', ml: '5%' }}>
          <div style={{ flex: 1 }}>
            <Grid container spacing={0.1}>
              <Grid item xs={12} sm={3}>
                {renderCard("Vendidos no mês", totalMes, "#ADD8E6")}
              </Grid>
              <Grid item xs={12} sm={3}>
                {renderCard("Vendidos hoje", totalDia, "#FFFACD")}
              </Grid>
              <Grid item xs={12} sm={3}>
                {renderCard("Itens em estoque", totalEstoque, "#ADD8E6")}
              </Grid>
              <Grid item xs={12} sm={3}>
                {renderCard("Clientes cadastrados", totalCliente, "#FFFACD")}
              </Grid>
            </Grid>
          </div>
        </TableContainer>

        <TableContainer component={Paper} sx={{ width: '50%', height: 'auto', ml: '1%' }}>
          <div style={{ flex: 1 }}>
            <Grid container spacing={0.6}>
              <Grid item xs={12} sm={6}>
                {renderCard("A Receber hoje", receberHoje, "#ADD8E6")}
              </Grid>
              <Grid item xs={12} sm={6}>
                {renderCard("A pagar hoje", pagarHoje, "#FFFACD")}
              </Grid>
              {/* <Grid item xs={12} sm={3}>
                {renderCard("Itens em estoque", totalEstoque, "#ADD8E6")}
              </Grid>
              <Grid item xs={12} sm={3}>
                {renderCard("Clientes cadastrados", totalCliente, "#FFFACD")}
              </Grid> */}
            </Grid>
          </div>
        </TableContainer>
      </Box>

      {/* Novo Box para os dois gráficos lado a lado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 2 }}>
        <TableContainer
          component={Paper}
          sx={{
            width: '30%',
            height: '60vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ml: '5%'
          }}
        >
          <div style={{ width: '70%' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </TableContainer>

        <TableContainer
          component={Paper}
          sx={{
            width: '30%',
            height: '60vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '90%' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </TableContainer>

        <TableContainer
          component={Paper}
          sx={{
            width: '50%',
            height: '60vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '100%' }}>
          {renderTabelaProdutos()}
          </div>
        </TableContainer>



      </Box>
      <Box sx={{ p: 2 }}>
      {/* Gráfico de barras de produtos */}
      <TableContainer
        component={Paper}
        sx={{
          width: '50%',
          height: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto',
        }}
      >
        <div style={{ width: '80%' }}>
          <Bar data={barDataProdutos} options={barOptionsProdutos} />
        </div>
      </TableContainer>
    </Box>
    </Box>
  );
};
