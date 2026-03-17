import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../shared/admin-api.service';
import { ExportService } from '../shared/export.service';

@Component({
  selector: 'app-users-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['../shared/dashboard.scss'],
  template: `
<div class="page">
  <div class="page__header"><h1>Usuarios</h1><div class="page__actions"><button class="btn btn--outline" (click)="csv()">📥 CSV</button><button class="btn btn--outline" (click)="pdf()">📄 PDF</button></div></div>
  <div class="filters"><button class="chip" [class.chip--on]="rf===''" (click)="rf='';load()">Todos ({{users.length}})</button><button class="chip" [class.chip--on]="rf==='CLIENT'" (click)="rf='CLIENT';load()">Clientes</button><button class="chip" [class.chip--on]="rf==='PROFESSIONAL'" (click)="rf='PROFESSIONAL';load()">Profesionales</button></div>
  <table class="table"><thead><tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Estado</th><th>Registro</th><th>Acción</th></tr></thead><tbody>
    <tr *ngFor="let u of users"><td><b>{{u.name||'Sin nombre'}}</b></td><td>{{u.email}}</td><td>{{u.phone||'—'}}</td><td><span class="badge" [class]="'badge--'+(u.active?'green':'red')">{{u.active?'Activo':'Inactivo'}}</span></td><td>{{u.createdAt|date:'d MMM yyyy'}}</td><td><button class="btn btn--sm" [class]="u.active?'btn--danger-outline':'btn--success'" (click)="toggle(u)">{{u.active?'Desactivar':'Activar'}}</button></td></tr>
  </tbody></table>
</div>`,
})
export class UsersMgmtComponent implements OnInit {
  users:any[]=[];rf='';
  constructor(public api:AdminApiService,private exp:ExportService){}
  ngOnInit(){this.load()}
  load(){this.api.getUsers(this.rf||undefined).subscribe(r=>this.users=r||[])}
  toggle(u:any){if(!confirm((u.active?'Desactivar':'Activar')+' a '+u.name+'?'))return;this.api.toggleUser(u.id).subscribe(()=>this.load())}
  csv(){this.exp.exportCSV(this.users,'goservi-usuarios',[{key:'name',label:'Nombre'},{key:'email',label:'Email'},{key:'phone',label:'Teléfono'},{key:'active',label:'Activo'},{key:'createdAt',label:'Registrado'}])}
  pdf(){this.exp.exportPDF(this.users,'Usuarios — GoServi',[{key:'name',label:'Nombre'},{key:'email',label:'Email'},{key:'active',label:'Activo'},{key:'createdAt',label:'Registrado'}])}
}
