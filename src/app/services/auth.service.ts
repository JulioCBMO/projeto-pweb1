import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAdmin = signal(false);
  isAuthenticated = signal(false);

  loginAsAdmin(password: string): boolean {
    if (password === 'admin123') {
      this.isAdmin.set(true);
      this.isAuthenticated.set(true);
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    return false;
  }

  loginAsUser(name: string): boolean {
    if (name && name.length >= 2) {
      this.isAdmin.set(false);
      this.isAuthenticated.set(true);
      localStorage.setItem('isAdmin', 'false');
      localStorage.setItem('userName', name);
      return true;
    }
    return false;
  }

  logout() {
    this.isAdmin.set(false);
    this.isAuthenticated.set(false);
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userName');
  }

  checkAuth() {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus) {
      this.isAdmin.set(adminStatus === 'true');
      this.isAuthenticated.set(true);
    }
  }
}