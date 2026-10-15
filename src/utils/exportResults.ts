import html2canvas from 'html2canvas';
import { TopsisRow, Market, Criterion } from '../types';

/**
 * Downloads a string content as a file in the browser.
 */
function downloadFile(content: string, mimeType: string, filename: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports the TOPSIS ranking results to CSV format.
 */
export function exportRankingToCsv(ranking: TopsisRow[], markets: Market[]) {
  let csv = 'Posicion,Mercado,Codigo,Coeficiente TOPSIS (CC),Clasificacion\n';
  ranking.forEach((row) => {
    const market = markets.find(m => m.id === row.marketId);
    csv += `${row.rank},"${row.marketName}","${market?.code || ''}",${row.cc.toFixed(4)},${row.level}\n`;
  });

  downloadFile(csv, 'text/csv;charset=utf-8;', 'ranking_mercados_fahp_topsis.csv');
}

/**
 * Exports the detailed results to an Excel-compatible XML spreadsheet.
 * This is a native XML schema that opens directly in Microsoft Excel as a spreadsheet.
 */
export function exportRankingToXlsx(ranking: TopsisRow[], markets: Market[], criteria: Criterion[]) {
  // Creating an Excel XML Spreadsheet format
  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#1E293B" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="14" ss:Color="#0F172A" ss:Bold="1"/>
  </Style>
  <Style ss:ID="BoldText">
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Bold="1"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Ranking de Mercados">
  <Table>
   <Row ss:Height="25">
    <Cell ss:StyleID="Title"><Data ss:Type="String">Sistema Inteligente de Recomendación de Mercados de Exportación</Data></Cell>
   </Row>
   <Row>
    <Cell><Data ss:Type="String">Priorización de Mercados mediante FAHP-TOPSIS - Fresa congelada Junín (HS 081110)</Data></Cell>
   </Row>
   <Row><Cell><Data ss:Type="String"></Data></Cell></Row>
   <Row ss:Height="20">
    <Cell ss:StyleID="Header"><Data ss:Type="String">Posición</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Mercado</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Código ISO</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Coeficiente TOPSIS (CC)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Clasificación</Data></Cell>
   </Row>`;

  ranking.forEach((row) => {
    const market = markets.find(m => m.id === row.marketId);
    xml += `
   <Row>
    <Cell><Data ss:Type="Number">${row.rank}</Data></Cell>
    <Cell><Data ss:Type="String">${row.marketName}</Data></Cell>
    <Cell><Data ss:Type="String">${market?.code || ''}</Data></Cell>
    <Cell><Data ss:Type="Number">${row.cc.toFixed(4)}</Data></Cell>
    <Cell><Data ss:Type="String">${row.level}</Data></Cell>
   </Row>`;
  });

  xml += `
  </Table>
 </Worksheet>
 <Worksheet ss:Name="Datos de Entrada">
  <Table>
   <Row ss:Height="20">
    <Cell ss:StyleID="Header"><Data ss:Type="String">Mercado</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Quality &amp; Safety (C1)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Importaciones t (C2)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">LPI (C3)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Arancel % (C4)</Data></Cell>
   </Row>`;

  markets.forEach((market) => {
    xml += `
   <Row>
    <Cell ss:StyleID="BoldText"><Data ss:Type="String">${market.name}</Data></Cell>
    <Cell><Data ss:Type="Number">${market.gfsi}</Data></Cell>
    <Cell><Data ss:Type="Number">${market.importations}</Data></Cell>
    <Cell><Data ss:Type="Number">${market.lpi}</Data></Cell>
    <Cell><Data ss:Type="Number">${market.arancel}</Data></Cell>
   </Row>`;
  });

  xml += `
  </Table>
 </Worksheet>
</Workbook>`;

  downloadFile(xml, 'application/vnd.ms-excel', 'resultados_topsis_exportacion.xls');
}

/**
 * Captures a DOM element and exports it as a PNG image.
 */
export async function exportElementToPng(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID '${elementId}' not found for PNG export.`);
    return false;
  }

  try {
    // Show a loading style if needed, wait for rendering
    const canvas = await html2canvas(element, {
      scale: 2, // Increase resolution for publication quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1440, // Anchor the layout width for consistent capture
      onclone: (clonedDoc) => {
        // We can manipulate the cloned document before capturing if necessary
        const clonedEl = clonedDoc.getElementById(elementId);
        if (clonedEl) {
          // Remove absolute headers or adjust padding if needed
          clonedEl.style.padding = '24px';
          clonedEl.style.borderRadius = '0px';
          clonedEl.style.boxShadow = 'none';
        }
      }
    });

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error during HTML to Canvas PNG export:', error);
    return false;
  }
}

/**
 * Triggers standard browser printing, styled for print.
 */
export function triggerPrint() {
  window.print();
}
