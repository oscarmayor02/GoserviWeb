import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../shared/admin-api.service';
import { ExportService } from '../shared/export.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['../shared/dashboard.scss'],
  template: `
<div class="page">
  <h1 style="font-size:1.5rem;font-weight:800;margin-bottom:8px">Reportes</h1>
  <p class="page__desc">Genera y descarga reportes de tu plataforma en CSV o PDF.</p>

  <div class="report-card">
    <div class="report-card__header"><h3>📊 Reporte de ingresos</h3><p>Ingresos diarios, comisiones y total de reservas por período.</p></div>
    <div class="report-card__filters">
      <div class="field"><label>Desde</label><input type="date" [(ngModel)]="from"></div>
      <div class="field"><label>Hasta</label><input type="date" [(ngModel)]="to"></div>
      <button class="btn btn--primary" (click)="loadRev()" [disabled]="loading">{{loading?'Cargando...':'Generar reporte'}}</button>
    </div>
    <div *ngIf="rev" class="report-card__results">
      <div class="stats-row"><div class="stat-box"><span>Ingresos totales</span><b>{{api.cop(rev.totalRevenue)}}</b></div><div class="stat-box"><span>Comisión plataforma</span><b>{{api.cop(rev.platformFees)}}</b></div><div class="stat-box"><span>Total reservas</span><b>{{rev.totalBookings}}</b></div><div class="stat-box"><span>Período</span><b>{{rev.period}}</b></div></div>
      <div class="report-card__export"><button class="btn btn--outline" (click)="revCSV()">📥 CSV</button><button class="btn btn--outline" (click)="revPDF()">📄 PDF</button></div>
      <table class="table" *ngIf="rev.dailyBreakdown?.length"><thead><tr><th>Fecha</th><th>Comisión</th><th>Reservas</th></tr></thead><tbody><tr *ngFor="let d of rev.dailyBreakdown"><td>{{d.date}}</td><td>{{api.cop(d.amount)}}</td><td>{{d.bookingCount}}</td></tr></tbody></table>
    </div>
  </div>

  <div class="report-card"><div class="report-card__header"><h3>👥 Exportar usuarios</h3><p>Lista completa de usuarios registrados.</p></div><div class="report-card__export"><button class="btn btn--outline" (click)="usersCSV()">📥 CSV</button><button class="btn btn--outline" (click)="usersPDF()">📄 PDF</button></div></div>
  <div class="report-card"><div class="report-card__header"><h3>📅 Exportar reservas</h3><p>Todas las reservas con estado y datos.</p></div><div class="report-card__export"><button class="btn btn--outline" (click)="bookCSV()">📥 CSV</button><button class="btn btn--outline" (click)="bookPDF()">📄 PDF</button></div></div>
  <div class="report-card"><div class="report-card__header"><h3>🛠️ Exportar servicios</h3><p>Ofertas de servicios activos e inactivos.</p></div><div class="report-card__export"><button class="btn btn--outline" (click)="svcCSV()">📥 CSV</button></div></div>
</div>`,
})
export class ReportsComponent {
  from=this.df(-30);to=this.df(0);rev:any=null;loading=false;
  constructor(public api:AdminApiService,private exp:ExportService){}
  private df(d:number):string{const x=new Date();x.setDate(x.getDate()+d);return x.toISOString().slice(0,10)}
  loadRev(){this.loading=true;this.api.getRevenueReport(this.from,this.to).subscribe({next:r=>{this.rev=r;this.loading=false},error:()=>{this.loading=false;alert('Error')}})}
  revCSV(){if(!this.rev?.dailyBreakdown)return;this.exp.exportCSV(this.rev.dailyBreakdown,'goservi-ingresos',[{key:'date',label:'Fecha'},{key:'amount',label:'Comisión'},{key:'bookingCount',label:'Reservas'}])}
  revPDF(){if(!this.rev?.dailyBreakdown)return;this.exp.exportPDF(this.rev.dailyBreakdown,'Reporte de Ingresos — GoServi',[{key:'date',label:'Fecha'},{key:'amount',label:'Comisión'},{key:'bookingCount',label:'Reservas'}])}
  usersCSV(){this.api.getUsers().subscribe(d=>this.exp.exportCSV(d,'goservi-usuarios',[{key:'name',label:'Nombre'},{key:'email',label:'Email'},{key:'phone',label:'Tel'},{key:'active',label:'Activo'},{key:'createdAt',label:'Registro'}]))}
  usersPDF(){this.api.getUsers().subscribe(d=>this.exp.exportPDF(d,'Usuarios — GoServi',[{key:'name',label:'Nombre'},{key:'email',label:'Email'},{key:'active',label:'Activo'},{key:'createdAt',label:'Registro'}]))}
  bookCSV(){this.api.getBookings().subscribe(d=>this.exp.exportCSV(d,'goservi-reservas',[{key:'clientName',label:'Cliente'},{key:'professionalName',label:'Profesional'},{key:'status',label:'Estado'},{key:'totalPrice',label:'Precio'},{key:'scheduledAt',label:'Programada'}]))}
  bookPDF(){this.api.getBookings().subscribe(d=>this.exp.exportPDF(d,'Reservas — GoServi',[{key:'clientName',label:'Cliente'},{key:'professionalName',label:'Profesional'},{key:'status',label:'Estado'},{key:'totalPrice',label:'Precio'},{key:'scheduledAt',label:'Programada'}]))}
  svcCSV(){this.api.getServiceOffers().subscribe(d=>this.exp.exportCSV(d,'goservi-servicios',[{key:'professionalName',label:'Profesional'},{key:'title',label:'Servicio'},{key:'category',label:'Categoría'},{key:'pricePerHour',label:'Precio/h'},{key:'active',label:'Activo'}]))}
}
