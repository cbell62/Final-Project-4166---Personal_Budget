import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../services/navbar.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'pb-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  isLoggedIn = false;
  role = '';
  user;
  password;
  formdata;

  constructor(private navbarService: NavbarService, private authService: AuthService, private router: Router) {
    this.navbarService.getLoginStatus().subscribe(status => this.isLoggedIn = status);
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
    if (this.user && this.password) { this.signup(); }
  }


  signup() {
    const creds = {
        username: this.user,
        password: this.password,
    };
    // console.log ('Creds', creds);
    // this.dataService.username = this.user;
    this.authService.postUserData(creds).subscribe((data) => {
      this.signupUser(data);
      // console.log('Login data', data);
    });
}

  signupUser(data) {
    if (data.success === true) {
      this.login();
    }
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
