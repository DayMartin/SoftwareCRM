import jsPDF from "jspdf";
import "jspdf-autotable";
import { VendasService } from "../../services/api/Vendas/VendasService";
import { ClienteService } from "../../services/api/Cliente/ClienteService";
import { VendaType } from "../../../core/venda.type";

export const generatePDFOrcamento = async (venda: VendaType) => {
  console.log("dados", venda);
  try {
    const doc = new jsPDF(); // Cria uma instância do jsPDF
    const marginRight = 20;
    const pageWidth = doc.internal.pageSize.getWidth(); 
    const textXPosition = pageWidth - marginRight; 

    // Cabeçalho com logo e informações da empresa
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Orçamento", 105, 20, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Empresa XYZ Ltda", 20, 35);
    doc.text("Endereço: Rua Exemplo, 123 - Cidade/Estado", 20, 40);

    doc.text("CNPJ: 00.000.000/0001-00", textXPosition, 35, { align: "right" });
    doc.text("Telefone: (00) 0000-0000", textXPosition, 40, { align: "right" });
    doc.text("Email: contato@empresa.com", textXPosition, 45, { align: "right" });

    // Linha horizontal
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 60, 190, 60);

    // Informações da venda
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Detalhes do Orçamento", 20, 75);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Orçamento válido por 20 dias`, 20, 85);
    doc.text(`Cliente: ${venda.cliente_id || "Desconhecido"}`, 20, 90);
    doc.text(`Vendedor: ${venda.funcionario_id || "Desconhecido"}`, 20, 95);

    doc.text(`Data: ${new Date().toLocaleDateString()}`, textXPosition, 100, { align: "right" });
    doc.text(`Total sem desconto: R$ ${venda.valorTotal}`, textXPosition, 105, { align: "right" });
    doc.text(`Desconto: R$ ${venda.valorDesconto}`, textXPosition, 110, { align: "right" });
    doc.text(`Total com desconto: R$ ${venda.valorTotalDesconto}`, textXPosition, 115, { align: "right" });

    // Linha horizontal
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, 120, 190, 120);

    // Tabela de itens vendidos
    const headersProdutos = [["Produto ID", "Produto", "Quantidade", "Preço Unitário", "Total"]];
    const rowsProdutos = venda?.produtos.map(produto => [
      produto.id,
      produto.nameProduto,
      produto.quantidade,
      `R$ ${produto.valorUnitario}`,
      `R$ ${(produto.quantidade * produto.valorUnitario).toFixed(2)}`,
    ]);

    (doc as any).autoTable({
      head: headersProdutos,
      body: rowsProdutos,
      startY: 125, 
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
    const headersParcelas = [["Parcela", "Data de Pagamento", "Tipo de Pagamento", "Valor"]];
    const rowsParcelas = venda?.parcelas.map(parcela => [
      parcela.parcela,
      new Date(parcela.dataPagamento).toLocaleDateString(),
      parcela.tipoPagamento,
      `R$ ${parcela.valorParcela.toFixed(2)}`,
    ]);

    (doc as any).autoTable({
      head: headersParcelas,
      body: rowsParcelas,
      startY: (doc as any).autoTable.previous.finalY + 15,
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
    doc.text("Assinatura do vendedor _______________________________________", 105, doc.internal.pageSize.height - 20, { align: "center" });

    // Gera o PDF como um URL de dados
    const pdfURL = doc.output("bloburl");

    // Abre o PDF em uma nova aba
    window.open(pdfURL);
  } catch (error) {
    console.error("Erro ao gerar PDF", error);
  }
};
