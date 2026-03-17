import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AdminApiService } from "../shared/admin-api.service";

@Component({
  selector: "app-tickets",
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ["../shared/dashboard.scss"],
  template: ` <div class="page">
    <div class="page__header">
      <h1>Tickets de soporte</h1>
      <div class="page__actions">
        <span class="kpi-inline kpi-inline--red" *ngIf="openCount"
          >{{ openCount }} abiertos</span
        >
        <span class="kpi-inline kpi-inline--blue" *ngIf="reviewCount"
          >{{ reviewCount }} en revisión</span
        >
      </div>
    </div>

    <div class="filters">
      <button
        class="chip"
        [class.chip--on]="sf === ''"
        (click)="sf = ''; load()"
      >
        Todos ({{ tickets.length }})
      </button>
      <button
        class="chip"
        [class.chip--on]="sf === 'OPEN'"
        (click)="sf = 'OPEN'; load()"
      >
        Abiertos
      </button>
      <button
        class="chip"
        [class.chip--on]="sf === 'IN_REVIEW'"
        (click)="sf = 'IN_REVIEW'; load()"
      >
        En revisión
      </button>
      <button
        class="chip"
        [class.chip--on]="sf === 'RESOLVED'"
        (click)="sf = 'RESOLVED'; load()"
      >
        Resueltos
      </button>
    </div>

    <div class="tickets-grid">
      <div
        class="ticket-card"
        *ngFor="let t of filtered"
        [class.ticket-card--open]="t.status === 'OPEN'"
        [class.ticket-card--review]="t.status === 'IN_REVIEW'"
        [class.ticket-card--resolved]="t.status === 'RESOLVED'"
      >
        <div class="ticket-card__top">
          <div>
            <span class="ticket-card__id">#{{ t.id }}</span>
            <span
              class="badge"
              [class]="'badge--' + api.statusColor(t.status)"
              >{{ api.statusLabel(t.status) }}</span
            >
          </div>
          <span class="ticket-card__type">{{ t.type }}</span>
        </div>
        <div class="ticket-card__user">
          <b>{{ t.userName }}</b> · <small>{{ t.userEmail }}</small> ·
          <small class="text-muted">{{ t.userRole }}</small>
        </div>
        <p class="ticket-card__desc">{{ t.description }}</p>
        <div class="ticket-card__booking" *ngIf="t.bookingId">
          Reserva: {{ t.bookingId | slice: 0 : 8 }}...
        </div>
        <div class="ticket-card__response" *ngIf="t.adminResponse">
          <b>Respuesta admin:</b> {{ t.adminResponse }}
        </div>
        <div class="ticket-card__meta">
          <span>{{ t.createdAt | date: "d MMM yyyy HH:mm" }}</span>
          <span *ngIf="t.updatedAt"
            >Actualizado: {{ t.updatedAt | date: "d MMM HH:mm" }}</span
          >
        </div>
        <div
          class="ticket-card__actions"
          *ngIf="t.status === 'OPEN' || t.status === 'IN_REVIEW'"
        >
          <textarea
            class="ticket-input"
            [(ngModel)]="responses[t.id]"
            placeholder="Escribe tu respuesta..."
            rows="2"
          ></textarea>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button
              class="btn btn--sm btn--primary"
              (click)="respond(t, 'RESOLVED')"
              [disabled]="!responses[t.id]"
            >
              Responder y cerrar
            </button>
            <button
              class="btn btn--sm btn--outline"
              (click)="respond(t, 'IN_REVIEW')"
              [disabled]="!responses[t.id]"
              *ngIf="t.status === 'OPEN'"
            >
              Marcar en revisión
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="empty" *ngIf="!filtered.length">
      Sin tickets{{ sf ? " con ese filtro" : "" }}
    </div>
  </div>`,
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];
  sf = "";
  responses: Record<number, string> = {};
  constructor(public api: AdminApiService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api
      .getTickets(this.sf || undefined)
      .subscribe((r) => (this.tickets = r || []));
  }

  get filtered() {
    return this.tickets;
  }
  get openCount() {
    return this.tickets.filter((t) => t.status === "OPEN").length;
  }
  get reviewCount() {
    return this.tickets.filter((t) => t.status === "IN_REVIEW").length;
  }

  respond(t: any, status: string) {
    const msg = this.responses[t.id];
    if (!msg) return;
    this.api.respondTicket(t.id, msg, status).subscribe({
      next: () => {
        delete this.responses[t.id];
        this.load();
      },
      error: (e) => alert(e?.error?.message || "Error"),
    });
  }
}
