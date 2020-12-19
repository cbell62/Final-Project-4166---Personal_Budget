import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  private links = new Array<{ text: string, path: string }>();
  private isLoggedIn = new Subject<boolean>();

  constructor() {
    // this.addItem({ text: 'Login / Sign up', path: 'login' });
    // this.isLoggedIn.next(false);
  }

  getLinks() {
    return this.links;
  }

  getLoginStatus() {
    return this.isLoggedIn;
  }

  updateLoginStatus(status: boolean) {
    this.isLoggedIn.next(status);

    if (!status) {
      this.clearAllItems();
      this.addItem({ text: 'Login / Sign up', path: 'login' });
    }
    else {
      this.clearAllItems();
      this.addItem({ text: 'Dashboard', path: 'dashboard'});
    }
  }

  // updateNavAfterAuth(role: string): void {
  //   this.removeItem({ text: 'Login / Sign up' });

  //   if (role === 'user') {
  //     this.addItem({ text: 'Dashboard', path: 'dashboard' });
  //   } else if (role === 'admin') {
  //     this.addItem({ text: 'Admin Board', path: 'admin' });
  //   }
  // }

  addItem({ text, path }) {
    this.links.push({ text: text, path: path });
  }

  removeItem({ text }) {
    this.links.forEach((link, index) => {
      if (link.text === text) {
        this.links.splice(index, 1);
      }
    });
  }

  clearAllItems() {
    this.links.length = 0;
  }
}
