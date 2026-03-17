import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { AdminApiService } from "../shared/admin-api.service";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

@Component({
  selector: "app-professional-detail",
  standalone: true,
  imports: [CommonModule],
  styleUrls: ["../shared/dashboard.scss"],
  template: ` <div class="page" *ngIf="pro">
      <button
        class="btn btn--outline"
        style="margin-bottom:20px"
        (click)="goBack()"
      >
        ← Volver al ranking
      </button>

      <!-- HEADER CARD -->
      <div class="detail-hero">
        <img
          [src]="pro.photo || 'assets/icon/default-avatar.png'"
          class="detail-hero__img"
          (error)="$any($event.target).src = 'assets/icon/default-avatar.png'"
        />
        <div class="detail-hero__info">
          <h1>{{ pro.name || "Profesional" }}</h1>
          <p>
            {{ pro.email }} · {{ pro.phone || "Sin teléfono" }} ·
            {{ pro.city || "Sin ciudad" }}
          </p>
          <p>Miembro desde {{ pro.memberSince | date: "d MMM yyyy" }}</p>
        </div>
        <div class="detail-hero__stats">
          <div class="detail-stat">
            <b>{{ pro.completedBookings }}</b
            ><span>Completados</span>
          </div>
          <div class="detail-stat">
            <b>{{ pro.totalBookings }}</b
            ><span>Total reservas</span>
          </div>
          <div class="detail-stat">
            <b class="highlight">{{ api.cop(pro.totalEarned) }}</b
            ><span>Ganado</span>
          </div>
          <div class="detail-stat">
            <b>⭐ {{ (pro.avgRating || 0).toFixed(1) }}</b
            ><span>{{ pro.reviewCount || 0 }} reseñas</span>
          </div>
          <div class="detail-stat">
            <b>{{ pro.activeOffers }}</b
            ><span>Ofertas activas</span>
          </div>
          <div class="detail-stat">
            <b>{{ api.cop(pro.availableBalance) }}</b
            ><span>Saldo disponible</span>
          </div>
        </div>
      </div>

      <!-- CHARTS -->
      <div class="charts-row">
        <div class="chart-card">
          <h3>Servicios por mes</h3>
          <canvas #servicesChart></canvas>
        </div>
        <div class="chart-card">
          <h3>Ingresos por mes</h3>
          <canvas #earningsChart></canvas>
        </div>
      </div>

      <!-- CLIENTS TABLE -->
      <h2 style="font-size:1.1rem;font-weight:700;margin:24px 0 14px">
        Clientes atendidos ({{ pro.clients?.length || 0 }})
      </h2>
      <table class="table" *ngIf="pro.clients?.length">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Servicios</th>
            <th>Total pagado</th>
            <th>Último servicio</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let c of pro.clients">
            <td>
              <div class="user-cell">
                <img
                  [src]="c.photo || 'assets/icon/default-avatar.png'"
                  class="user-cell__img"
                  (error)="
                    $any($event.target).src = 'assets/icon/default-avatar.png'
                  "
                />
                <b>{{ c.name || "Cliente" }}</b>
              </div>
            </td>
            <td>
              <b>{{ c.bookingCount }}</b>
            </td>
            <td class="highlight">{{ api.cop(c.totalSpent) }}</td>
            <td>{{ c.lastBooking | date: "d MMM yyyy" }}</td>
          </tr>
        </tbody>
      </table>
      <div class="empty" *ngIf="!pro.clients?.length">
        Sin clientes registrados
      </div>
    </div>
    <div *ngIf="!pro" style="padding:80px;text-align:center;color:#8B9AB5">
      Cargando...
    </div>`,
})
export class ProfessionalDetailComponent implements OnInit, AfterViewInit {
  @ViewChild("servicesChart") servicesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("earningsChart") earningsCanvas!: ElementRef<HTMLCanvasElement>;
  pro: any = null;
  private id!: number;

  constructor(
    public api: AdminApiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get("id"));
    this.api.getProfessionalDetail(this.id).subscribe((r) => {
      this.pro = r;
      setTimeout(() => this.buildCharts(), 100);
    });
  }

  ngAfterViewInit() {}

  goBack() {
    this.router.navigate(["/web/admin/professionals"]);
  }

  private buildCharts() {
    if (!this.pro) return;

    // Services by month
    if (
      this.servicesCanvas?.nativeElement &&
      this.pro.servicesByMonth?.length
    ) {
      new Chart(this.servicesCanvas.nativeElement, {
        type: "bar",
        data: {
          labels: this.pro.servicesByMonth.map((m: any) => m.label),
          datasets: [
            {
              label: "Servicios",
              data: this.pro.servicesByMonth.map((m: any) => m.count),
              backgroundColor: "rgba(0,119,255,.7)",
              borderRadius: 6,
              barPercentage: 0.6,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        },
      });
    }

    // Earnings by month
    if (
      this.earningsCanvas?.nativeElement &&
      this.pro.earningsByMonth?.length
    ) {
      new Chart(this.earningsCanvas.nativeElement, {
        type: "line",
        data: {
          labels: this.pro.earningsByMonth.map((m: any) => m.label),
          datasets: [
            {
              label: "Ingresos",
              data: this.pro.earningsByMonth.map((m: any) => m.amount),
              borderColor: "#10B981",
              backgroundColor: "rgba(16,185,129,.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: "#10B981",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });
    }
  }
}
