import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AdminApiService {
  private base = "http://localhost:8080/admin";

  constructor(private http: HttpClient) {}

  private get h(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
    });
  }

  // ── DASHBOARD ────────────────────────────────────────
  getDashboard(): Observable<any> {
    return this.http.get(`${this.base}/dashboard`, { headers: this.h });
  }
  getRevenueChart(days = 30): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.base}/dashboard/revenue-chart?days=${days}`,
      { headers: this.h },
    );
  }
  getTopProfessionals(limit = 10): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.base}/dashboard/top-professionals?limit=${limit}`,
      { headers: this.h },
    );
  }

  // ── CASH ─────────────────────────────────────────────
  getCashPending(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/payments/cash/pending`, {
      headers: this.h,
    });
  }
  approveCash(id: string): Observable<any> {
    return this.http.post(
      `${this.base}/payments/${id}/approve-cash`,
      {},
      { headers: this.h },
    );
  }
  rejectCash(id: string, reason: string): Observable<any> {
    return this.http.post(
      `${this.base}/payments/${id}/reject-cash`,
      { reason },
      { headers: this.h },
    );
  }

  // ── PAYMENTS ─────────────────────────────────────────
  getPayments(status?: string): Observable<any[]> {
    const url = status
      ? `${this.base}/payments?status=${status}`
      : `${this.base}/payments`;
    return this.http.get<any[]>(url, { headers: this.h });
  }

  // ── WITHDRAWALS ──────────────────────────────────────
  getWithdrawals(status?: string): Observable<any[]> {
    const url = status
      ? `${this.base}/withdrawals?status=${status}`
      : `${this.base}/withdrawals`;
    return this.http.get<any[]>(url, { headers: this.h });
  }
  processWithdrawal(id: string): Observable<any> {
    return this.http.post(
      `${this.base}/withdrawals/${id}/process`,
      {},
      { headers: this.h },
    );
  }
  rejectWithdrawal(id: string, reason: string): Observable<any> {
    return this.http.post(
      `${this.base}/withdrawals/${id}/reject`,
      { reason },
      { headers: this.h },
    );
  }

  // ── USERS ────────────────────────────────────────────
  getUsers(role?: string): Observable<any[]> {
    const url = role ? `${this.base}/users?role=${role}` : `${this.base}/users`;
    return this.http.get<any[]>(url, { headers: this.h });
  }
  toggleUser(id: number): Observable<any> {
    return this.http.post(
      `${this.base}/users/${id}/toggle-active`,
      {},
      { headers: this.h },
    );
  }

  // ── BOOKINGS ─────────────────────────────────────────
  getBookings(status?: string, from?: string, to?: string): Observable<any[]> {
    let url = `${this.base}/bookings`;
    const p: string[] = [];
    if (status) p.push(`status=${status}`);
    if (from) p.push(`from=${from}`);
    if (to) p.push(`to=${to}`);
    if (p.length) url += "?" + p.join("&");
    return this.http.get<any[]>(url, { headers: this.h });
  }

  // ── SERVICE OFFERS ───────────────────────────────────
  getServiceOffers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/service-offers`, {
      headers: this.h,
    });
  }
  toggleServiceOffer(id: number): Observable<any> {
    return this.http.post(
      `${this.base}/service-offers/${id}/toggle-active`,
      {},
      { headers: this.h },
    );
  }

  // ── TICKETS ──────────────────────────────────────────
  getTickets(status?: string): Observable<any[]> {
    const url = status
      ? `${this.base}/tickets?status=${status}`
      : `${this.base}/tickets`;
    return this.http.get<any[]>(url, { headers: this.h });
  }
  respondTicket(
    id: number,
    response: string,
    status = "RESOLVED",
  ): Observable<any> {
    return this.http.post(
      `${this.base}/tickets/${id}/respond`,
      { response, status },
      { headers: this.h },
    );
  }

  // ── REPORTS ──────────────────────────────────────────
  getRevenueReport(from: string, to: string): Observable<any> {
    return this.http.get(`${this.base}/reports/revenue?from=${from}&to=${to}`, {
      headers: this.h,
    });
  }

  // ══════════════════════════════════════════════════════
  // ★ NUEVOS ENDPOINTS ★
  // ══════════════════════════════════════════════════════

  // Ranking de profesionales
  getProfessionalRanking(limit = 50): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.base}/professionals/ranking?limit=${limit}`,
      { headers: this.h },
    );
  }

  // Detalle de un profesional
  getProfessionalDetail(id: number): Observable<any> {
    return this.http.get(`${this.base}/professionals/${id}/detail`, {
      headers: this.h,
    });
  }

  // Ranking de clientes
  getClientRanking(limit = 50): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/clients/ranking?limit=${limit}`, {
      headers: this.h,
    });
  }

  // Estadísticas mensuales
  getMonthlyStats(months = 12): Observable<any> {
    return this.http.get(`${this.base}/stats/monthly?months=${months}`, {
      headers: this.h,
    });
  }

  // ── HELPERS ──────────────────────────────────────────
  cop(n: number): string {
    if (!n) return "$0";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);
  }
  statusLabel(s: string): string {
    const m: Record<string, string> = {
      PENDING: "Pendiente",
      PENDING_CASH: "Efectivo pend.",
      CONFIRMED: "Confirmada",
      ARRIVED: "Llegó",
      IN_PROGRESS: "En progreso",
      COMPLETED: "Completada",
      PAID: "Pagada",
      CANCELLED: "Cancelada",
      REJECTED: "Rechazada",
      FAILED: "Fallido",
      OPEN: "Abierto",
      IN_REVIEW: "En revisión",
      RESOLVED: "Resuelto",
      PROCESSING: "Procesando",
      PROCESSED: "Procesado",
    };
    return m[s] || s;
  }
  statusColor(s: string): string {
    const m: Record<string, string> = {
      PENDING: "amber",
      PENDING_CASH: "amber",
      CONFIRMED: "blue",
      ARRIVED: "orange",
      IN_PROGRESS: "purple",
      COMPLETED: "green",
      PAID: "green",
      CANCELLED: "gray",
      REJECTED: "red",
      FAILED: "red",
      OPEN: "amber",
      IN_REVIEW: "blue",
      RESOLVED: "green",
      PROCESSING: "blue",
      PROCESSED: "green",
    };
    return m[s] || "gray";
  }
}
