import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-web-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './web-dashboard.component.html',
  styleUrls: ['./web-dashboard.component.scss'],
})
export class WebDashboardComponent {
  sideOpen = false;
  userName = localStorage.getItem('userName') || 'Admin';
  userEmail = localStorage.getItem('userEmail') || '';
  today = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  get initials(): string {
    return this.userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  constructor(private router: Router) {}

  logout() { localStorage.clear(); this.router.navigate(['/web/login']); }
}
