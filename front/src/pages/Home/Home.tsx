import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import TodayIcon from "@mui/icons-material/Today";
import { Paper, TableContainer } from "@mui/material";
import React, { useEffect, useState } from "react";
import { VendasService } from "../../shared/services/api/Vendas/VendasService";
import { EstoqueService } from "../../shared/services/api/Estoque/EstoqueService";
import { ClienteService } from "../../shared/services/api/Cliente/ClienteService";

// import Chart from 'chart.js/auto';

export const Home = () => {
  const [totalMes, setTotalMes] = useState(0);
  const [totalDia, setTotalDia] = useState(0)
  const [totalEstoque, setTotalEstoque] = useState(0)
  const [totalCliente, setTotalCliente] = useState(0)


  React.useEffect(() => {
    consultarMes();
    consultarDia();
    consultarTotalEstoque();
    consultarTotalCliente();
  }, );


  const consultarMes = async() => {
    try {
      const resultado = await VendasService.getAllMes()
      if (resultado instanceof Error) {
        // alert(response.message);
      } else {
        const totals = resultado.total
        setTotalMes(totals)

      }
    } catch (error) {
      console.error("Erro ao consultar mês", error)
    }
  }

  const consultarDia = async() => {
    try {
      const resultado = await VendasService.getAllDia()
      if (resultado instanceof Error) {
        // alert(response.message);
      } else {
        const totals = resultado.total
        setTotalDia(totals)

      }
    } catch (error) {
      console.error("Erro ao consultar dia", error)
    }
  }

  const consultarTotalEstoque = async() => {
    try {
      const resultado = await EstoqueService.getAll()
      if (resultado instanceof Error) {
        // alert(response.message);
      } else {
        const totals = resultado.total
        console.log("totals", totals)
        setTotalEstoque(totals)

      }
    } catch (error) {
      console.error("Erro ao consultar estoque", error)
    }
  }

  const consultarTotalCliente = async() => {
    try {
      const resultado = await ClienteService.getClientes()
      if (resultado instanceof Error) {
        // alert(response.message);
      } else {
        const totals = resultado.total
        console.log("totals", totals)
        setTotalCliente(totals)

      }
    } catch (error) {
      console.error("Erro ao consultar estoque", error)
    }
  }

  return (
    <TableContainer component={Paper} sx={{ m: 1, width: 'auto',  marginLeft: '8%', marginRight: '2%' }}>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <Card
            sx={{
              minWidth: 10,
              backgroundColor: "#F0F8FF",
              boxShadow: "none",
              borderRadius: 6,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography
                sx={{ fontSize: 16, textAlign: "center", margin: "auto" }}
                color="text.secondary"
                gutterBottom
              >
                Vendidos no mês {totalMes}
              </Typography>

            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card
            sx={{
              minWidth: 20,
              backgroundColor: "#F5F5DC",
              boxShadow: "none",
              borderRadius: 6,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography
                sx={{ fontSize: 16, textAlign: "center", margin: "auto" }}
                color="text.secondary"
                gutterBottom
              >
                Vendidos hoje {totalDia}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card
            sx={{
              minWidth: 20,
              backgroundColor: "#FFDAB9",
              boxShadow: "none",
              borderRadius: 6,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography
                sx={{ fontSize: 16, textAlign: "center", margin: "auto" }}
                color="text.secondary"
                gutterBottom
              >
                Itens cadastrados no estoque {totalEstoque}
              </Typography>

            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card
            sx={{
              minWidth: 20,
              backgroundColor: "#FFF5EE",
              boxShadow: "none",
              borderRadius: 6,
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography
                sx={{ fontSize: 16, textAlign: "center", margin: "auto" }}
                color="text.secondary"
                gutterBottom
              >
               Clientes cadastrados {totalCliente}
              </Typography>

            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </TableContainer>

  );
};
