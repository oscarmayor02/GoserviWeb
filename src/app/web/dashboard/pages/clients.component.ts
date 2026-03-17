import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdminApiService } from "../shared/admin-api.service";
import { ExportService } from "../shared/export.service";

@Component({
  selector: "app-clients",
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ["../shared/dashboard.scss"],
  template: ` <div class="page">
    <div class="page__header">
      <h1>Clientes</h1>
      <div class="page__actions">
        <input
          class="search-input"
          placeholder="Buscar..."
          [(ngModel)]="search"
        />
        <button class="btn btn--outline" (click)="csv()">📥 CSV</button>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi">
        <span class="kpi__val">{{ filtered.length }}</span
        ><span class="kpi__lbl">Clientes</span>
      </div>
      <div class="kpi">
        <span class="kpi__val kpi--blue">{{ totalBookings }}</span
        ><span class="kpi__lbl">Reservas totales</span>
      </div>
      <div class="kpi">
        <span class="kpi__val kpi--green">{{ api.cop(totalSpent) }}</span
        ><span class="kpi__lbl">Total gastado</span>
      </div>
      <div class="kpi">
        <span class="kpi__val kpi--purple">{{ totalPros }}</span
        ><span class="kpi__lbl">Profesionales contratados</span>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Cliente</th>
          <th>Reservas</th>
          <th>Completadas</th>
          <th>Total gastado</th>
          <th>Profesionales</th>
          <th>Rating dado</th>
          <th>Desde</th>
          <th>Última reserva</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let c of filtered; let i = index">
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
                [src]="c.photo || 'assets/icon/default-avatar.png'"
                class="user-cell__img"
                (error)="
                  $any($event.target).src = 'assets/icon/default-avatar.png'
                "
              />
              <div>
                <b>{{ c.name || "Sin nombre" }}</b
                ><br /><small>{{ c.email }}</small>
              </div>
            </div>
          </td>
          <td>
            <b>{{ c.totalBookings }}</b>
          </td>
          <td>{{ c.completedBookings }}</td>
          <td class="highlight">{{ api.cop(c.totalSpent) }}</td>
          <td>{{ c.uniqueProfessionals }}</td>
          <td>
            <span *ngIf="c.avgRatingGiven"
              >⭐ {{ c.avgRatingGiven.toFixed(1) }}</span
            ><span *ngIf="!c.avgRatingGiven" class="text-muted">—</span>
          </td>
          <td>{{ c.memberSince | date: "d MMM yyyy" }}</td>
          <td>{{ c.lastBooking | date: "d MMM yyyy" }}</td>
        </tr>
      </tbody>
    </table>
    <div class="empty" *ngIf="!filtered.length && !loading">
      Sin clientes con reservas
    </div>
  </div>`,
})
export class ClientsComponent implements OnInit {
  clients: any[] = [];
  search = "";
  loading = true;
  constructor(
    public api: AdminApiService,
    private exp: ExportService,
  ) {}

  ngOnInit() {
    this.api.getClientRanking(100).subscribe((r) => {
      this.clients = r || [];
      this.loading = false;
    });
  }

  get filtered() {
    const s = this.search.toLowerCase();
    return this.clients.filter(
      (c) =>
        !s ||
        (c.name || "").toLowerCase().includes(s) ||
        (c.email || "").toLowerCase().includes(s),
    );
  }
  get totalBookings() {
    return this.filtered.reduce(
      (a: number, c: any) => a + (c.totalBookings || 0),
      0,
    );
  }
  get totalSpent() {
    return this.filtered.reduce(
      (a: number, c: any) => a + (c.totalSpent || 0),
      0,
    );
  }
  get totalPros() {
    return this.filtered.reduce(
      (a: number, c: any) => a + (c.uniqueProfessionals || 0),
      0,
    );
  }

  csv() {
    this.exp.exportCSV(this.filtered, "goservi-clientes", [
      { key: "name", label: "Nombre" },
      { key: "email", label: "Email" },
      { key: "totalBookings", label: "Reservas" },
      { key: "completedBookings", label: "Completadas" },
      { key: "totalSpent", label: "Gastado" },
      { key: "uniqueProfessionals", label: "Profesionales" },
    ]);
  }
}
