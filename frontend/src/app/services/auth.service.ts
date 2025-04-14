import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private loginUrl = 'http://localhost:8000/token';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public loginEvent = new EventEmitter<void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { 
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCurrentUser();
    }
  }

  private initializeCurrentUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
    }
  }

  private getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.post(`${this.loginUrl}`, body.toString(), { headers }).pipe(
      map(user => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.loginEvent.emit();
        console.log("Login Successful", user);
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { name, email, password });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser()?.access_token;
  }

  getAccessToken(): string | null {
    const currentUser = this.getCurrentUser();
    return currentUser?.access_token || null;
  }

  refreshToken(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null);
    }
    return this.http.post(`${this.apiUrl}/token/refresh`, {}).pipe(
      map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  isTokenExpired(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }
    const user = this.getCurrentUser();
    if (!user || !user.access_token) return true;
    
    const jwtData = user.access_token.split('.')[1];
    const decodedJwtJsonData = window.atob(jwtData);
    const decodedJwtData = JSON.parse(decodedJwtJsonData);
    
    const expirationMs = decodedJwtData.exp * 1000;
    return Date.now() >= expirationMs;
  }
}