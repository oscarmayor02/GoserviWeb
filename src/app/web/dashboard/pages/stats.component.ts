import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminApiService } from "../shared/admin-api.service";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

@Component({
  selector: "app-stats",
  standalone: true,
  imports: [CommonModule],
  styleUrls: ["../shared/dashboard.scss"],
  template: ` <div class="page" *ngIf="stats">
      <h1 style="font-size:1.5rem;font-weight:800;margin-bottom:24px">
        Estadísticas mensuales
      </h1>

      <!-- COMPARISONS -->
      <div class="kpi-row">
        <div class="kpi" *ngFor="let c of comparisons">
          <span
            class="kpi__val"
            [class.kpi--green]="c.changePercent > 0"
            [class.kpi--red]="c.changePercent < 0"
          >
            {{
              c.label === "Ingresos" || c.label === "Comisión"
                ? api.cop(c.current)
                : c.current
            }}
          </span>
          <span class="kpi__lbl">{{ c.label }} este mes</span>
          <span
            class="kpi__change"
            [class.kpi__change--up]="c.changePercent > 0"
            [class.kpi__change--down]="c.changePercent < 0"
          >
            {{ c.changePercent > 0 ? "+" : "" }}{{ c.changePercent }}% vs mes
            anterior
          </span>
        </div>
      </div>

      <!-- CHARTS ROW 1: Bookings + Revenue -->
      <div class="charts-row">
        <div class="chart-card">
          <h3>Servicios completados por mes</h3>
          <canvas #bookingsChart></canvas>
        </div>
        <div class="chart-card">
          <h3>Ingresos por mes</h3>
          <canvas #revenueChart></canvas>
        </div>
      </div>

      <!-- CHARTS ROW 2: Fees + New Users -->
      <div class="charts-row">
        <div class="chart-card">
          <h3>Comisión GoServi por mes</h3>
          <canvas #feesChart></canvas>
        </div>
        <div class="chart-card">
          <h3>Nuevos usuarios por mes</h3>
          <canvas #usersChart></canvas>
        </div>
      </div>

      <!-- CHARTS ROW 3: Category + Payment Methods -->
      <div class="charts-row">
        <div class="chart-card">
          <h3>Servicios por categoría</h3>
          <canvas #categoryChart></canvas>
        </div>
        <div class="chart-card">
          <h3>Métodos de pago</h3>
          <canvas #paymentChart></canvas>
        </div>
      </div>
    </div>
    <div *ngIf="!stats" style="padding:80px;text-align:center;color:#8B9AB5">
      Cargando estadísticas...
    </div>`,
})
export class StatsComponent implements OnInit {
  @ViewChild("bookingsChart") bookingsCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("revenueChart") revenueCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("feesChart") feesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("usersChart") usersCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("categoryChart") categoryCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild("paymentChart") paymentCanvas!: ElementRef<HTMLCanvasElement>;

  stats: any = null;
  comparisons: any[] = [];

  constructor(public api: AdminApiService) {}

  ngOnInit() {
    this.api.getMonthlyStats(12).subscribe((r) => {
      this.stats = r;
      this.comparisons = [r.bookings, r.revenue, r.platformFees, r.newUsers];
      setTimeout(() => this.buildCharts(), 100);
    });
  }

  private buildCharts() {
    if (!this.stats) return;
    const blue = "rgba(0,119,255,.75)";
    const blueLight = "rgba(0,119,255,.08)";
    const green = "#10B981";
    const greenLight = "rgba(16,185,129,.08)";
    const purple = "#7C3AED";
    const purpleLight = "rgba(124,58,237,.08)";
    const amber = "#F59E0B";

    // Bookings bar
    if (this.bookingsCanvas?.nativeElement) {
      new Chart(this.bookingsCanvas.nativeElement, {
        type: "bar",
        data: {
          labels: this.stats.bookingsByMonth.map((m: any) => m.label),
          datasets: [
            {
              label: "Servicios",
              data: this.stats.bookingsByMonth.map((m: any) => m.count),
              backgroundColor: blue,
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

    // Revenue line
    if (this.revenueCanvas?.nativeElement) {
      new Chart(this.revenueCanvas.nativeElement, {
        type: "line",
        data: {
          labels: this.stats.revenueByMonth.map((m: any) => m.label),
          datasets: [
            {
              label: "Ingresos",
              data: this.stats.revenueByMonth.map((m: any) => m.amount),
              borderColor: green,
              backgroundColor: greenLight,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: green,
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

    // Fees line
    if (this.feesCanvas?.nativeElement) {
      new Chart(this.feesCanvas.nativeElement, {
        type: "line",
        data: {
          labels: this.stats.feesByMonth.map((m: any) => m.label),
          datasets: [
            {
              label: "Comisión",
              data: this.stats.feesByMonth.map((m: any) => m.amount),
              borderColor: purple,
              backgroundColor: purpleLight,
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: purple,
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

    // New users bar
    if (this.usersCanvas?.nativeElement) {
      new Chart(this.usersCanvas.nativeElement, {
        type: "bar",
        data: {
          labels: this.stats.newUsersByMonth.map((m: any) => m.label),
          datasets: [
            {
              label: "Usuarios",
              data: this.stats.newUsersByMonth.map((m: any) => m.count),
              backgroundColor: amber,
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

    // Category doughnut
    if (
      this.categoryCanvas?.nativeElement &&
      this.stats.bookingsByCategory?.length
    ) {
      const colors = [
        "#0077FF",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#7C3AED",
        "#EC4899",
        "#06B6D4",
        "#84CC16",
      ];
      new Chart(this.categoryCanvas.nativeElement, {
        type: "doughnut",
        data: {
          labels: this.stats.bookingsByCategory.map((c: any) => c.category),
          datasets: [
            {
              data: this.stats.bookingsByCategory.map((c: any) => c.count),
              backgroundColor: colors.slice(
                0,
                this.stats.bookingsByCategory.length,
              ),
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: { padding: 16, font: { size: 12 } },
            },
          },
        },
      });
    }

    // Payment methods doughnut
    if (
      this.paymentCanvas?.nativeElement &&
      this.stats.paymentMethods?.length
    ) {
      const pmColors: Record<string, string> = {
        WOMPI: "#0077FF",
        CASH: "#10B981",
        UNKNOWN: "#94A3B8",
      };
      new Chart(this.paymentCanvas.nativeElement, {
        type: "doughnut",
        data: {
          labels: this.stats.paymentMethods.map((m: any) =>
            m.method === "WOMPI"
              ? "Wompi (Online)"
              : m.method === "CASH"
                ? "Efectivo"
                : m.method,
          ),
          datasets: [
            {
              data: this.stats.paymentMethods.map((m: any) => m.count),
              backgroundColor: this.stats.paymentMethods.map(
                (m: any) => pmColors[m.method] || "#94A3B8",
              ),
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: { padding: 16, font: { size: 12 } },
            },
          },
        },
      });
    }
  }
}
