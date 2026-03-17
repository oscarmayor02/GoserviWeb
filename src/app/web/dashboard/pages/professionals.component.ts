import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AdminApiService } from "../shared/admin-api.service";
import { ExportService } from "../shared/export.service";

@Component({
  selector: "app-professionals",
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ["../shared/dashboard.scss"],
  template: ` <div class="page">
    <div class="page__header">
      <h1>Profesionales</h1>
      <div class="page__actions">
        <input
          class="search-input"
          placeholder="Buscar por nombre..."
          [(ngModel)]="search"
        />
        <button class="btn btn--outline" (click)="csv()">📥 CSV</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi">
        <span class="kpi__val">{{ filtered.length }}</span
        ><span class="kpi__lbl">Total</span>
      </div>
      <div class="kpi">
        <span class="kpi__val kpi--blue">{{ totalClients }}</span
        ><span class="kpi__lbl">Clientes atendidos</span>
      </div>
      <div class="kpi">
        <span class="kpi__val kpi--green">{{ api.cop(totalEarned) }}</span
        ><span class="kpi__lbl">Ganado total</span>
      </div>
      <div class="kpi">
        <span class="kpi__val kpi--purple">{{ api.cop(totalFees) }}</span
        ><span class="kpi__lbl">Comisión GoServi</span>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Profesional</th>
          <th>Servicios</th>
          <th>Clientes</th>
          <th>Ganado</th>
          <th>Comisión GoServi</th>
          <th>Rating</th>
          <th>Reseñas</th>
          <th>Ofertas</th>
          <th>Desde</th>
        </tr>
      </thead>
      <tbody>
        <tr
          *ngFor="let p of filtered; let i = index"
          class="clickable"
          (click)="goDetail(p.id)"
        >
          <td>
            <span
              class="rank-badge"
              [class.rank--gold]="i === 0"
              [class.rank--silver]="i === 1"
              [class.rank--bronze]="i === 2"
              >{{ i + 1 }}</span
            >
          </td>
          <td>
            <div class="user-cell">
              <img
                [src]="p.photo || 'assets/icon/default-avatar.png'"
                class="user-cell__img"
                (error)="
                  $any($event.target).src = 'assets/icon/default-avatar.png'
                "
              />
              <div>
                <b>{{ p.name || "Sin nombre" }}</b
                ><br /><small>{{ p.email }}</small>
              </div>
            </div>
          </td>
          <td>
            <b>{{ p.completedBookings }}</b>
          </td>
          <td>{{ p.uniqueClients }}</td>
          <td class="highlight">{{ api.cop(p.totalEarned) }}</td>
          <td>{{ api.cop(p.platformFeeGenerated) }}</td>
          <td>
            <span class="rating-badge" *ngIf="p.avgRating"
              >⭐ {{ p.avgRating.toFixed(1) }}</span
            ><span *ngIf="!p.avgRating" class="text-muted">—</span>
          </td>
          <td>{{ p.reviewCount || 0 }}</td>
          <td>{{ p.activeOffers }}</td>
          <td>{{ p.memberSince | date: "d MMM yyyy" }}</td>
        </tr>
      </tbody>
    </table>
    <div class="empty" *ngIf="!filtered.length && !loading">
      Sin profesionales con servicios completados
    </div>
  </div>`,
})
export class ProfessionalsComponent implements OnInit {
  pros: any[] = [];
  search = "";
  loading = true;
  constructor(
    public api: AdminApiService,
    private exp: ExportService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.api.getProfessionalRanking(100).subscribe((r) => {
      this.pros = r || [];
      this.loading = false;
    });
  }

  get filtered() {
    const s = this.search.toLowerCase();
    return this.pros.filter(
      (p) =>
        !s ||
        (p.name || "").toLowerCase().includes(s) ||
        (p.email || "").toLowerCase().includes(s),
    );
  }
  get totalClients() {
    return this.filtered.reduce(
      (a: number, p: any) => a + (p.uniqueClients || 0),
      0,
    );
  }
  get totalEarned() {
    return this.filtered.reduce(
      (a: number, p: any) => a + (p.totalEarned || 0),
      0,
    );
  }
  get totalFees() {
    return this.filtered.reduce(
      (a: number, p: any) => a + (p.platformFeeGenerated || 0),
      0,
    );
  }

  goDetail(id: number) {
    this.router.navigate(["/web/admin/professionals", id]);
  }
  csv() {
    this.exp.exportCSV(this.filtered, "goservi-profesionales", [
      { key: "name", label: "Nombre" },
      { key: "email", label: "Email" },
      { key: "completedBookings", label: "Servicios" },
      { key: "uniqueClients", label: "Clientes" },
      { key: "totalEarned", label: "Ganado" },
      { key: "platformFeeGenerated", label: "Comisión" },
      { key: "avgRating", label: "Rating" },
      { key: "reviewCount", label: "Reseñas" },
    ]);
  }
}
