import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../shared/admin-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['../shared/dashboard.scss'],
  template: `
<div class="page" *ngIf="stats">
  <h1 style="font-size:1.5rem;font-weight:800;margin-bottom:24px">Resumen ejecutivo</h1>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:14px;margin-bottom:28px">
    <div style="grid-column:span 4;background:linear-gradient(135deg,#0055CC,#0077FF 40%,#00A3FF);border-radius:18px;padding:24px;color:#fff;position:relative;overflow:hidden">
      <div style="position:absolute;top:-30px;right:-30px;width:120px;height:120px;background:rgba(255,255,255,.05);border-radius:50%"></div>
      <div style="font-size:.6rem;font-weight:700;letter-spacing:1.5px;color:rgba(255,255,255,.5);margin-bottom:4px">INGRESOS PLATAFORMA (COMISIÓN)</div>
      <div style="font-size:2.2rem;font-weight:800;letter-spacing:-.02em">{{ api.cop(stats.platformRevenue) }}</div>
      <div style="display:flex;gap:28px;margin-top:14px">
        <div><div style="font-size:.62rem;color:rgba(255,255,255,.45)">Semana</div><div style="font-size:.95rem;font-weight:700">{{ api.cop(stats.revenueThisWeek) }}</div></div>
        <div><div style="font-size:.62rem;color:rgba(255,255,255,.45)">Mes</div><div style="font-size:.95rem;font-weight:700">{{ api.cop(stats.revenueThisMonth) }}</div></div>
        <div><div style="font-size:.62rem;color:rgba(255,255,255,.45)">Bruto total</div><div style="font-size:.95rem;font-weight:700">{{ api.cop(stats.totalRevenue) }}</div></div>
      </div>
    </div>
    <div class="stat-box"><span>Usuarios</span><b>{{ stats.totalUsers }}</b></div>
    <div class="stat-box"><span>Reservas</span><b>{{ stats.totalBookings }}</b></div>
    <div class="stat-box"><span>Pagadas</span><b style="color:#059669">{{ stats.paidBookings }}</b></div>
    <div class="stat-box"><span>Rating</span><b>⭐ {{ (stats.averageRating||0).toFixed(1) }}</b></div>
  </div>

  <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:14px">Pendientes de atención</h2>
  <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:28px">
    <div *ngIf="stats.pendingCashPayments>0" style="flex:1;min-width:200px;padding:14px 18px;background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:12px;cursor:pointer;display:flex;align-items:center;gap:10px" (click)="go('finances')">
      <b style="font-size:1.3rem;color:#D97706">{{ stats.pendingCashPayments }}</b><span style="font-size:.84rem;color:#92400E;font-weight:600">comisiones por verificar</span>
    </div>
    <div *ngIf="stats.pendingWithdrawals>0" style="flex:1;min-width:200px;padding:14px 18px;background:#EFF6FF;border:1.5px solid #BFDBFE;border-radius:12px;cursor:pointer;display:flex;align-items:center;gap:10px" (click)="go('finances')">
      <b style="font-size:1.3rem;color:#2563EB">{{ stats.pendingWithdrawals }}</b><span style="font-size:.84rem;color:#1E40AF;font-weight:600">retiros pendientes ({{ api.cop(stats.pendingWithdrawalsAmount) }})</span>
    </div>
    <div *ngIf="stats.openTickets>0" style="flex:1;min-width:200px;padding:14px 18px;background:#FEF2F2;border:1.5px solid #FECACA;border-radius:12px;display:flex;align-items:center;gap:10px">
      <b style="font-size:1.3rem;color:#DC2626">{{ stats.openTickets }}</b><span style="font-size:.84rem;color:#991B1B;font-weight:600">tickets abiertos</span>
    </div>
    <div *ngIf="!stats.pendingCashPayments && !stats.pendingWithdrawals && !stats.openTickets" style="flex:1;padding:14px 18px;background:#ECFDF5;border:1.5px solid #A7F3D0;border-radius:12px;display:flex;align-items:center;gap:10px">
      <b style="font-size:1.3rem;color:#059669">✓</b><span style="font-size:.84rem;color:#065F46;font-weight:600">Todo al día</span>
    </div>
  </div>

  <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:14px">Pipeline de reservas</h2>
  <div style="background:#fff;border:1px solid #E4EBF5;border-radius:14px;padding:20px">
    <div *ngFor="let p of pipeline" style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:.82rem;color:#5A6B87">{{ p.name }}</span><span style="font-size:.82rem;font-weight:700;color:#0B1527">{{ p.count }}</span></div>
      <div style="height:8px;background:#F0F4FA;border-radius:8px;overflow:hidden"><div [style.width]="p.pct+'%'" [style.background]="p.bg" style="height:100%;border-radius:8px;min-width:2px;transition:width .8s"></div></div>
    </div>
  </div>
</div>
<div *ngIf="!stats" style="padding:80px;text-align:center;color:#8B9AB5">Cargando...</div>
  `,
})
export class OverviewComponent implements OnInit {
  stats: any = null;
  pipeline: any[] = [];
  constructor(public api: AdminApiService, private router: Router) {}
  ngOnInit() {
    this.api.getDashboard().subscribe(s => {
      this.stats = s;
      const t = s.totalBookings || 1;
      this.pipeline = [
        { name: 'Pendientes', count: s.pendingBookings, pct: (s.pendingBookings/t*100), bg: '#F59E0B' },
        { name: 'Confirmadas', count: s.confirmedBookings, pct: (s.confirmedBookings/t*100), bg: '#0077FF' },
        { name: 'En progreso', count: s.inProgressBookings, pct: (s.inProgressBookings/t*100), bg: '#7C3AED' },
        { name: 'Completadas + Pagadas', count: (s.completedBookings||0)+(s.paidBookings||0), pct: ((s.completedBookings+s.paidBookings)/t*100), bg: '#10B981' },
        { name: 'Canceladas', count: s.cancelledBookings, pct: (s.cancelledBookings/t*100), bg: '#EF4444' },
      ];
    });
  }
  go(path: string) { this.router.navigateByUrl(`/web/admin/${path}`); }
}
