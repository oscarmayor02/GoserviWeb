import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-landing",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  menuOpen = false;
  private observer!: IntersectionObserver;
  private counterObserver!: IntersectionObserver;
  private counted = false;
  faqs = [
    {
      question: "¿Cómo funciona el pago seguro?",
      answer:
        "El pago se retiene hasta que confirmas que el servicio se realizó correctamente. Puedes pagar con Wompi (tarjeta, PSE, Nequi) o en efectivo directamente al profesional.",
      open: true,
    },
    {
      question: "¿Puedo cancelar una reserva?",
      answer:
        "Sí, puedes cancelar gratis hasta 24 horas antes del servicio. Después de ese plazo, puede aplicarse un cargo parcial dependiendo del profesional.",
      open: false,
    },
    {
      question: "¿Cómo se verifican los profesionales?",
      answer:
        "Verificamos identidad, antecedentes y experiencia. Además, el sistema de reseñas y calificaciones asegura calidad continua.",
      open: false,
    },
    {
      question: "¿Puedo reservar servicios recurrentes?",
      answer:
        "Sí, puedes programar servicios semanales o quincenales con tu profesional favorito desde la app.",
      open: false,
    },
    {
      question: "¿Cuál es la comisión de GoServi?",
      answer:
        "La comisión base es del 15% por servicio completado. GoServi retiene este porcentaje para cubrir costos de plataforma, soporte y garantía.",
      open: false,
    },
    {
      question: "¿Qué pasa si el servicio no es satisfactorio?",
      answer:
        "Tienes garantía de reembolso. Si el servicio no cumple, contacta soporte y evaluamos tu caso para devolver el dinero.",
      open: false,
    },
  ];

  services = [
    {
      name: "Limpieza del hogar",
      desc: "Profesionales certificados. Profunda o semanal.",
      price: "Desde $40.000/h",
      rating: "4.9",
      tag: "Popular",
      img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&h=360&fit=crop",
    },
    {
      name: "Manicure y pedicure",
      desc: "Gel, acrílico, diseños. Todo a domicilio.",
      price: "Desde $35.000",
      rating: "4.8",
      tag: "Belleza",
      img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=360&fit=crop",
    },
    {
      name: "Plomería",
      desc: "Reparaciones e instalaciones. 24/7.",
      price: "Desde $50.000/h",
      rating: "4.7",
      tag: "Urgencias",
      img: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=500&h=360&fit=crop",
    },
    {
      name: "Electricidad",
      desc: "Instalaciones seguras garantizadas.",
      price: "Desde $55.000/h",
      rating: "4.8",
      tag: "Certificado",
      img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&h=360&fit=crop",
    },
    {
      name: "Cerrajería",
      desc: "Apertura, chapas, duplicados.",
      price: "Desde $30.000",
      rating: "4.6",
      tag: "24/7",
      img: "./assets/cerrajeria.jpg",
    },
    {
      name: "Pintura",
      desc: "Interior y exterior, acabados pro.",
      price: "Desde $45.000/h",
      rating: "4.9",
      tag: "Popular",
      img: "./assets/pintor.png",
    },
  ];

  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            this.observer.unobserve(e.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    document
      .querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale")
      .forEach((el) => this.observer.observe(el));

    this.counterObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && !this.counted) {
            this.counted = true;
            this.animateCounters();
          }
        }),
      { threshold: 0.5 },
    );
    const trustEl = document.querySelector(".tr");
    if (trustEl) this.counterObserver.observe(trustEl);

    this.createParticles();
    window.addEventListener("scroll", this.handleScroll);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.counterObserver?.disconnect();
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    document
      .getElementById("mainNav")
      ?.classList.toggle("s", window.scrollY > 40);
  };

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    this.menuOpen = false;
  }

  goLogin() {
    this.router.navigate(["/web/login"]);
  }

  private animateCounters() {
    document
      .querySelectorAll<HTMLElement>(".tr__n[data-target]")
      .forEach((el) => {
        const target = parseFloat(el.dataset["target"] || "0");
        const prefix = el.dataset["prefix"] || "";
        const suffix = el.dataset["suffix"] || "";
        const decimal = parseInt(el.dataset["decimal"] || "0");
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1800, 1);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent =
            prefix +
            (decimal
              ? (e * target).toFixed(decimal)
              : Math.floor(e * target).toLocaleString("es-CO")) +
            suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
  }

  private createParticles() {
    const c = document.getElementById("particles");
    if (!c) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 8 + Math.random() * 12 + "s";
      p.style.animationDelay = Math.random() * 10 + "s";
      const s = 2 + Math.random() * 4;
      p.style.width = p.style.height = s + "px";
      c.appendChild(p);
    }
  }
}
