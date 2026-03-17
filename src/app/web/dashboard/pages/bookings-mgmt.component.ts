import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../shared/admin-api.service';
import { ExportService } from '../shared/export.service';

@Component({
  selector: 'app-bookings-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['../shared/dashboard.scss'],
  template: `
<div class="page">
  <div class="page__header"><h1>Reservas</h1><div class="page__actions"><button class="btn btn--outline" (click)="csv()">📥 CSV</button><button class="btn btn--outline" (click)="pdf()">📄 PDF</button></div></div>
  <div class="filters"><button class="chip" [class.chip--on]="sf===''" (click)="sf='';load()">Todas</button><button class="chip" [class.chip--on]="sf==='PENDING'" (click)="sf='PENDING';load()">Pendientes</button><button class="chip" [class.chip--on]="sf==='CONFIRMED'" (click)="sf='CONFIRMED';load()">Confirmadas</button><button class="chip" [class.chip--on]="sf==='IN_PROGRESS'" (click)="sf='IN_PROGRESS';load()">En progreso</button><button class="chip" [class.chip--on]="sf==='COMPLETED'" (click)="sf='COMPLETED';load()">Completadas</button><button class="chip" [class.chip--on]="sf==='PAID'" (click)="sf='PAID';load()">Pagadas</button><button class="chip" [class.chip--on]="sf==='CANCELLED'" (click)="sf='CANCELLED';load()">Canceladas</button></div>
  <table class="table"><thead><tr><th>Cliente</th><th>Profesional</th><th>Estado</th><th>Precio</th><th>Programada</th><th>Creada</th></tr></thead><tbody>
    <tr *ngFor="let b of bookings"><td>{{b.clientName}}</td><td>{{b.professionalName}}</td><td><span class="badge" [class]="'badge--'+api.statusColor(b.status)">{{api.statusLabel(b.status)}}</span></td><td>{{b.totalPrice?api.cop(b.totalPrice):'—'}}</td><td>{{b.scheduledAt|date:'d MMM yyyy HH:mm'}}</td><td>{{b.createdAt|date:'d MMM yyyy'}}</td></tr>
  </tbody></table>
</div>`,
})
export class BookingsMgmtComponent implements OnInit {
  bookings:any[]=[];sf='';
  constructor(public api:AdminApiService,private exp:ExportService){}
  ngOnInit(){this.load()}
  load(){this.api.getBookings(this.sf||undefined).subscribe(r=>this.bookings=r||[])}
  csv(){this.exp.exportCSV(this.bookings,'goservi-reservas',[{key:'clientName',label:'Cliente'},{key:'professionalName',label:'Profesional'},{key:'status',label:'Estado'},{key:'totalPrice',label:'Precio'},{key:'scheduledAt',label:'Programada'},{key:'createdAt',label:'Creada'}])}
  pdf(){this.exp.exportPDF(this.bookings,'Reservas — GoServi',[{key:'clientName',label:'Cliente'},{key:'professionalName',label:'Profesional'},{key:'status',label:'Estado'},{key:'totalPrice',label:'Precio'},{key:'scheduledAt',label:'Programada'}])}
}
