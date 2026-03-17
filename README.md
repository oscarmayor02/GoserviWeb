# GoServi Web — Landing + Admin Dashboard

## Instalación

```bash
cd goservi-web-app
npm install
npm start
```

Abre en el navegador:
- **http://localhost:4200** → Landing pública (redirige a /web)
- **http://localhost:4200/web** → Landing con servicios, testimonios, etc.
- **http://localhost:4200/web/login** → Login admin
- **http://localhost:4200/web/admin** → Dashboard admin (requiere login)

## Requisitos

- Node.js 18+
- Angular CLI 17 (`npm install -g @angular/cli`)
- Backend GoServi corriendo en `http://localhost:8080`

## Estructura

```
src/app/web/
├── landing/          → Landing pública v5 (animaciones, scroll reveal, contadores)
├── login/            → Login exclusivo para ADMIN
└── dashboard/        → Dashboard admin con sidebar
    ├── pages/
    │   ├── overview      → Resumen ejecutivo (KPIs, pipeline, alertas)
    │   ├── finances      → Pagos + Efectivo + Retiros (aprobar/rechazar)
    │   ├── users-mgmt    → Usuarios (filtrar, activar/desactivar)
    │   ├── bookings-mgmt → Reservas (7 filtros de status)
    │   └── reports       → Reportes con descarga CSV y PDF
    └── shared/
        ├── admin-api.service.ts  → Todas las llamadas HTTP a /admin/*
        ├── export.service.ts     → Exportar CSV y PDF
        └── dashboard.scss        → Estilos compartidos (tablas, badges, botones)
```

## Funcionalidades del Dashboard

- **Resumen**: Revenue hero, stats, alertas de pendientes, pipeline de reservas
- **Finanzas**: 3 tabs (efectivo/pagos/retiros), aprobar/rechazar comisiones y retiros
- **Usuarios**: Tabla con filtros por rol, activar/desactivar cuentas
- **Reservas**: Tabla con filtros por status
- **Reportes**: Selector de fechas, reporte de ingresos diario, exportar TODO a CSV y PDF

## Conectar con tu proyecto Ionic existente

Si prefieres integrarlo en tu app Ionic en vez de correrlo aparte:

1. Copia `src/app/web/` dentro de tu proyecto Ionic
2. Agrega las rutas de `src/app/app.routes.ts` a tu `app-routing.module.ts`
3. Listo — las rutas `/web/*` funcionan junto a tus rutas Ionic
