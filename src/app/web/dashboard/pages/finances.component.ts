import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../shared/admin-api.service';
import { ExportService } from '../shared/export.service';

@Component({
  selector: 'app-finances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['../shared/dashboard.scss'],
  template: `
<div class="page">
  <div class="page__header"><h1>Finanzas</h1><div class="page__actions"><button class="btn btn--outline" (click)="exportPaymentsCSV()">📥 CSV Pagos</button><button class="btn btn--outline" (click)="exportPaymentsPDF()">📄 PDF Pagos</button></div></div>
  <div class="tabs"><button class="tab" [class.tab--on]="tab==='cash'" (click)="tab='cash';loadCash()">Efectivo <span class="tab__badge" *ngIf="cash.length">{{cash.length}}</span></button><button class="tab" [class.tab--on]="tab==='payments'" (click)="tab='payments';loadPayments()">Pagos</button><button class="tab" [class.tab--on]="tab==='withdrawals'" (click)="tab='withdrawals';loadW()">Retiros</button></div>

  <div *ngIf="tab==='cash'"><div class="empty" *ngIf="!cash.length"><p>Sin comisiones pendientes ✓</p></div>
    <table class="table" *ngIf="cash.length"><thead><tr><th>Profesional</th><th>Cliente</th><th>Total</th><th>Comisión</th><th>Fecha</th><th>Acciones</th></tr></thead><tbody>
      <tr *ngFor="let p of cash"><td><b>{{p.professionalName}}</b><br><small>{{p.professionalEmail}}</small></td><td>{{p.clientName}}</td><td>{{api.cop(p.totalAmount)}}</td><td class="highlight">{{api.cop(p.platformFee)}}</td><td>{{p.createdAt|date:'d MMM yyyy HH:mm'}}</td><td><div class="table__actions"><button class="btn btn--sm btn--success" (click)="approveCash(p)" [disabled]="aid===p.paymentId">Aprobar</button><button class="btn btn--sm btn--danger-outline" (click)="rejectCash(p)">Rechazar</button></div></td></tr>
    </tbody></table></div>

  <div *ngIf="tab==='payments'"><div class="filters"><button class="chip" [class.chip--on]="pf===''" (click)="pf='';loadPayments()">Todos</button><button class="chip" [class.chip--on]="pf==='PENDING'" (click)="pf='PENDING';loadPayments()">Pendientes</button><button class="chip" [class.chip--on]="pf==='PENDING_CASH'" (click)="pf='PENDING_CASH';loadPayments()">Efectivo</button><button class="chip" [class.chip--on]="pf==='PAID'" (click)="pf='PAID';loadPayments()">Pagados</button></div>
    <table class="table"><thead><tr><th>Cliente</th><th>Profesional</th><th>Monto</th><th>Comisión</th><th>Estado</th><th>Fecha</th></tr></thead><tbody><tr *ngFor="let p of payments"><td>{{p.clientName}}</td><td>{{p.professionalName}}</td><td>{{api.cop(p.amount)}}</td><td>{{api.cop(p.platformFee)}}</td><td><span class="badge" [class]="'badge--'+api.statusColor(p.status)">{{api.statusLabel(p.status)}}</span></td><td>{{p.createdAt|date:'d MMM HH:mm'}}</td></tr></tbody></table></div>

  <div *ngIf="tab==='withdrawals'"><div class="page__actions" style="margin-bottom:16px"><button class="btn btn--outline" (click)="exportWCSV()">📥 CSV Retiros</button></div>
    <table class="table"><thead><tr><th>Profesional</th><th>Banco</th><th>Cuenta</th><th>Monto</th><th>Estado</th><th>Acciones</th></tr></thead><tbody><tr *ngFor="let w of withdrawals"><td><b>{{w.professionalName}}</b><br><small>{{w.professionalEmail}}</small></td><td>{{w.bankName}}</td><td>{{w.bankAccount}}</td><td class="highlight">{{api.cop(w.amount)}}</td><td><span class="badge" [class]="'badge--'+api.statusColor(w.status)">{{api.statusLabel(w.status)}}</span></td><td><div class="table__actions" *ngIf="w.status==='PENDING'"><button class="btn btn--sm btn--success" (click)="processW(w)">Procesado</button><button class="btn btn--sm btn--danger-outline" (click)="rejectW(w)">Rechazar</button></div><span *ngIf="w.status!=='PENDING'" class="text-muted">—</span></td></tr></tbody></table></div>
</div>`,
})
export class FinancesComponent implements OnInit {
  tab:'cash'|'payments'|'withdrawals'='cash'; cash:any[]=[]; payments:any[]=[]; withdrawals:any[]=[]; pf=''; aid:string|null=null;
  constructor(public api:AdminApiService,private exp:ExportService){}
  ngOnInit(){this.loadCash()}
  loadCash(){this.api.getCashPending().subscribe(r=>this.cash=r||[])}
  loadPayments(){this.api.getPayments(this.pf||undefined).subscribe(r=>this.payments=r||[])}
  loadW(){this.api.getWithdrawals().subscribe(r=>this.withdrawals=r||[])}
  approveCash(p:any){if(!confirm('¿Verificaste la transferencia de '+this.api.cop(p.platformFee)+'?'))return;this.aid=p.paymentId;this.api.approveCash(p.paymentId).subscribe({next:()=>{this.aid=null;this.loadCash();alert('Aprobado ✓')},error:e=>{this.aid=null;alert(e?.error?.message||'Error')}})}
  rejectCash(p:any){const r=prompt('Motivo:','No verificada');if(!r)return;this.api.rejectCash(p.paymentId,r).subscribe(()=>this.loadCash())}
  processW(w:any){if(!confirm('¿Transferiste '+this.api.cop(w.amount)+' a '+w.professionalName+'?'))return;this.api.processWithdrawal(w.id).subscribe({next:()=>{this.loadW();alert('Procesado ✓')},error:e=>alert(e?.error?.message||'Error')})}
  rejectW(w:any){const r=prompt('Motivo:');if(!r)return;this.api.rejectWithdrawal(w.id,r).subscribe(()=>this.loadW())}
  exportPaymentsCSV(){this.api.getPayments().subscribe(d=>this.exp.exportCSV(d,'goservi-pagos',[{key:'clientName',label:'Cliente'},{key:'professionalName',label:'Profesional'},{key:'amount',label:'Monto'},{key:'platformFee',label:'Comisión'},{key:'status',label:'Estado'},{key:'createdAt',label:'Fecha'}]))}
  exportPaymentsPDF(){this.api.getPayments().subscribe(d=>this.exp.exportPDF(d,'Reporte de Pagos — GoServi',[{key:'clientName',label:'Cliente'},{key:'professionalName',label:'Profesional'},{key:'amount',label:'Monto'},{key:'platformFee',label:'Comisión'},{key:'status',label:'Estado'},{key:'createdAt',label:'Fecha'}]))}
  exportWCSV(){this.api.getWithdrawals().subscribe(d=>this.exp.exportCSV(d,'goservi-retiros',[{key:'professionalName',label:'Profesional'},{key:'bankName',label:'Banco'},{key:'bankAccount',label:'Cuenta'},{key:'amount',label:'Monto'},{key:'status',label:'Estado'},{key:'createdAt',label:'Fecha'}]))}
}
