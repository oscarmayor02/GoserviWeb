import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-admin-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-login.component.html",
  styleUrls: ["./admin-login.component.scss"],
})
export class AdminLoginComponent {
  email = "";
  password = "";
  showPass = false;
  loading = false;
  error = "";

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login() {
    if (!this.email || !this.password) {
      this.error = "Ingresa correo y contraseña";
      return;
    }
    this.loading = true;
    this.error = "";
    this.http
      .post<any>(`${environment.apiUrl}/auth/login`, {
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.activeRole !== "ADMIN") {
            this.error = "Solo administradores pueden acceder al panel web";
            return;
          }
          localStorage.setItem("authToken", res.token);
          localStorage.setItem("activeRole", res.activeRole);
          localStorage.setItem("userId", String(res.userId));
          localStorage.setItem("userName", res.name || "");
          localStorage.setItem("userEmail", this.email);
          this.router.navigate(["/web/admin"]);
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || "Credenciales incorrectas";
        },
      });
  }

  goBack() {
    this.router.navigate(["/web"]);
  }
}
