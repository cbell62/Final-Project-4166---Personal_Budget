import { Component, NgZone, OnInit } from '@angular/core';
import { NavbarService } from '../services/navbar.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';




@Component({
  selector: 'pb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoggedIn = false;
  role = '';
  user;
  password;
  formdata;
  mySubscription: any;
  sessionExpired = false;


  constructor(private authService: AuthService,
              private navbarService: NavbarService,
              private router: Router)
  {
    this.navbarService.getLoginStatus().subscribe(status => this.isLoggedIn = status);
    if (!!authService.getJwtToken()) {
      this.sessionExpired = authService.tokenExpired();
      this.authService.removeTokens();
    }
    else { this.sessionExpired = false; }
  }

  ngOnInit() {
    this.formdata = new FormGroup({
      user: new FormControl(''),
      passwd: new FormControl('')
    });
  }

  onClickSubmit(data) {
    this.user = data.user;
    this.password = data.passwd;
    if (this.user && this.password) { this.login(); }
  }

  login() {
    this.authService.login(
      {
        username: this.user,
        password: this.password
      }
    )
    .subscribe(success => {
      if (success) {
        this.navbarService.updateLoginStatus(true);
        this.router.navigate(['/dashboard']);
      }
    });
  }

}




