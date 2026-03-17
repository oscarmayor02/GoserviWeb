import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ExportService {

  exportCSV(data: any[], filename: string, columns: { key: string; label: string }[]) {
    if (!data?.length) return;
    const headers = columns.map(c => c.label).join(',');
    const rows = data.map(row =>
      columns.map(c => {
        let val = row[c.key];
        if (val === null || val === undefined) val = '';
        val = String(val).replace(/"/g, '""');
        if (String(val).includes(',') || String(val).includes('\n')) val = `"${val}"`;
        return val;
      }).join(',')
    );
    const csv = '\uFEFF' + headers + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, `${filename}.csv`);
  }

  exportPDF(data: any[], title: string, columns: { key: string; label: string }[]) {
    if (!data?.length) return;
    const now = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    const tableRows = data.map(row =>
      '<tr>' + columns.map(c =>
        `<td style="padding:8px 12px;border-bottom:1px solid #E4EBF5;font-size:12px;color:#2D3E5C">${row[c.key] ?? ''}</td>`
      ).join('') + '</tr>'
    ).join('');

    const html = `<!DOCTYPE html><html><head><title>${title}</title>
      <style>
        body{font-family:-apple-system,system-ui,sans-serif;color:#0B1527;margin:40px}
        h1{font-size:20px;font-weight:700;margin-bottom:4px}
        .date{font-size:12px;color:#5A6B87;margin-bottom:24px}
        .logo{font-size:18px;font-weight:800;margin-bottom:20px}.logo span{color:#0077FF}
        table{width:100%;border-collapse:collapse;margin-top:16px}
        th{text-align:left;padding:10px 12px;background:#F7F9FC;border-bottom:2px solid #D1DBEB;font-size:11px;font-weight:600;color:#5A6B87;text-transform:uppercase;letter-spacing:.5px}
        .footer{margin-top:32px;font-size:11px;color:#8B9AB5;border-top:1px solid #E4EBF5;padding-top:12px}
        @media print{body{margin:20px}@page{margin:15mm}}
      </style></head><body>
      <div class="logo">Go<span>Servi</span></div>
      <h1>${title}</h1>
      <div class="date">Generado el ${now} · ${data.length} registros</div>
      <table><thead><tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr></thead>
      <tbody>${tableRows}</tbody></table>
      <div class="footer">GoServi — Reporte generado automáticamente · ${now}</div>
      </body></html>`;

    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 500); }
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
}
