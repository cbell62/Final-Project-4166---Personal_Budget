
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { NavbarService } from '../services/navbar.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'pb-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  links: Array<{ text: string, path: string }>;
  isLoggedIn = null;

  constructor(private router: Router, private navbarService: NavbarService, private authService: AuthService) {
    this.router.config.unshift(
      { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], canLoad: [AuthGuard] },
    );
  }

  ngOnInit() {
    this.links = this.navbarService.getLinks();
    this.navbarService.getLoginStatus().subscribe(status => this.isLoggedIn = status);
    this.isLoggedIn = !!this.authService.getLoggedUser();
  }


  logout() {
    this.authService.logout()
      .subscribe(success => {
        if (success) {
          this.router.navigate(['home']);
        }
      });
  }
}



