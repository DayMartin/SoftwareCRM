import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { VendasService } from "../../services/api/Vendas/VendasService";
import { ClienteService } from "../../services/api/Cliente/ClienteService";
import { ParcelasService } from "../../services/api/Vendas/ParcelasVendaService";

export const generatePDF = async (idVenda: number) => {
  try {
    // Obtendo dados da venda
    const venda = await VendasService.getByID(idVenda);
    if (venda instanceof Error) {
      console.error("Erro ao buscar venda", venda);
      return;
    }

    // Obtendo dados do cliente
    const idCliente = Number(venda.cliente_id);
    const cliente = await ClienteService.getClienteByID(idCliente);
    if (cliente instanceof Error) {
      console.error("Erro ao buscar cliente", cliente);
      return;
    }

    // Obtendo dados dos produtos
    const produtos = await VendasService.getByProdutoMovimento(idVenda);
    if (produtos instanceof Error) {
      console.error("Erro ao buscar produtos", produtos);
      return;
    }

    // Obtendo dados das parcelas
    const parcelas = await VendasService.getByVenda(idVenda);
    if (parcelas instanceof Error) {
      console.error("Erro ao buscar parcelas", parcelas);
      return;
    }

    const doc = new jsPDF(); // Cria uma instância do jsPDF

    // Cabeçalho com logo e informações da empresa
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Comprovante de Venda", 105, 20, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Empresa XYZ Ltda", 20, 35);
    doc.text("Endereço: Rua Exemplo, 123 - Cidade/Estado", 20, 40);
    doc.text("CNPJ: 00.000.000/0001-00", 20, 45);
    doc.text("Telefone: (00) 0000-0000", 20, 50);
    doc.text("Email: contato@empresa.com", 20, 55);

    // Linha horizontal
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 60, 190, 60);

    // Informações da venda
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Detalhes da Venda", 20, 75);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`ID da Venda: ${venda.id}`, 20, 85);
    doc.text(`Cliente: ${cliente.nome || 'Desconhecido'}`, 20, 90);
    doc.text(`Data: ${new Date(venda.data_criacao).toLocaleDateString()}`, 20, 95);
    doc.text(`Total: R$ ${venda.valorTotalDesconto}`, 20, 100);

    // Linha horizontal
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 105, 190, 105);

    // Tabela de itens vendidos
    const headersProdutos = [["Produto ID", "Produto", "Quantidade", "Preço Unitário", "Total"]];
    const rowsProdutos = produtos.map(produto => [
      produto.id,
      produto.nameProduto,
      produto.quantidade,
      `R$ ${produto.valorUnitario}`,
      `R$ ${(produto.quantidade * produto.valorUnitario)}`,
    ]);

    // Adiciona a tabela de produtos no PDF
    (doc as any).autoTable({
      head: headersProdutos,
      body: rowsProdutos,
      startY: 110, // Inicia a tabela após as informações da venda
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
        halign: 'center',
        valign: 'middle',
        lineColor: [44, 62, 80],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [236, 240, 241],
      },
      theme: 'striped',
    });

    // Linha horizontal antes da tabela de parcelas
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, (doc as any).autoTable.previous.finalY + 10, 190, (doc as any).autoTable.previous.finalY + 10);

    // Tabela de parcelas
    const headersParcelas = [["Parcela", "Data de Pagamento", "Status", "Tipo de Pagamento", "Valor"]];
    const rowsParcelas = parcelas.map(parcela => [
      parcela.parcela,
      new Date(parcela.dataPagamento).toLocaleDateString(),
      parcela.status,
      parcela.tipoPagamento,
      `R$ ${parcela.valorParcela}`,
    ]);

    // Adiciona a tabela de parcelas no PDF
    (doc as any).autoTable({
      head: headersParcelas,
      body: rowsParcelas,
      startY: (doc as any).autoTable.previous.finalY + 15, // Inicia a tabela após a tabela de produtos
      margin: { left: 20, right: 20 },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
        halign: 'center',
        valign: 'middle',
        lineColor: [44, 62, 80],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [236, 240, 241],
      },
      theme: 'striped',
    });

    // Rodapé
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("Obrigado pela sua compra!", 105, doc.internal.pageSize.height - 20, { align: "center" });

    // Gera o PDF como um URL de dados
    const pdfURL = doc.output("bloburl");

    // Abre o PDF em uma nova aba
    window.open(pdfURL);
  } catch (error) {
    console.error("Erro ao gerar PDF", error);
  }
};
