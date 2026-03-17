import { Routes } from "@angular/router";

export const routes: Routes = [
  { path: "", redirectTo: "web", pathMatch: "full" },
  {
    path: "web",
    loadComponent: () =>
      import("./web/landing/landing.component").then((m) => m.LandingComponent),
  },
  {
    path: "web/login",
    loadComponent: () =>
      import("./web/login/admin-login.component").then(
        (m) => m.AdminLoginComponent,
      ),
  },
  {
    path: "web/admin",
    loadComponent: () =>
      import("./web/dashboard/web-dashboard.component").then(
        (m) => m.WebDashboardComponent,
      ),
    children: [
      { path: "", redirectTo: "overview", pathMatch: "full" },
      {
        path: "overview",
        loadComponent: () =>
          import("./web/dashboard/pages/overview.component").then(
            (m) => m.OverviewComponent,
          ),
      },
      {
        path: "finances",
        loadComponent: () =>
          import("./web/dashboard/pages/finances.component").then(
            (m) => m.FinancesComponent,
          ),
      },
      {
        path: "users",
        loadComponent: () =>
          import("./web/dashboard/pages/users-mgmt.component").then(
            (m) => m.UsersMgmtComponent,
          ),
      },
      {
        path: "bookings",
        loadComponent: () =>
          import("./web/dashboard/pages/bookings-mgmt.component").then(
            (m) => m.BookingsMgmtComponent,
          ),
      },
      {
        path: "reports",
        loadComponent: () =>
          import("./web/dashboard/pages/reports.component").then(
            (m) => m.ReportsComponent,
          ),
      },
      // ★ NUEVAS PÁGINAS ★
      {
        path: "professionals",
        loadComponent: () =>
          import("./web/dashboard/pages/professionals.component").then(
            (m) => m.ProfessionalsComponent,
          ),
      },
      {
        path: "professionals/:id",
        loadComponent: () =>
          import("./web/dashboard/pages/professional-detail.component").then(
            (m) => m.ProfessionalDetailComponent,
          ),
      },
      {
        path: "clients",
        loadComponent: () =>
          import("./web/dashboard/pages/clients.component").then(
            (m) => m.ClientsComponent,
          ),
      },
      {
        path: "stats",
        loadComponent: () =>
          import("./web/dashboard/pages/stats.component").then(
            (m) => m.StatsComponent,
          ),
      },
      {
        path: "tickets",
        loadComponent: () =>
          import("./web/dashboard/pages/tickets.component").then(
            (m) => m.TicketsComponent,
          ),
      },
    ],
  },
];
