import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private loginUrl='http://localhost:8000/token';
  private currentUserSubject:BehaviorSubject<any>;
  public currentUser:Observable<any>;

  constructor(
    private http: HttpClient,
    private router:Router,
    @Inject(PLATFORM_ID) private platformId:Object
  ) { 
    this.currentUserSubject=new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')||'{}'));
    this.currentUser=this.currentUserSubject.asObservable();
  }

  private getCurrentUser():any{
    if(isPlatformBrowser(this.platformId)){
      return JSON.parse(localStorage.getItem('currentUser')|| '{}')
    }
    return {};
  }

  login(email: string, password: string): Observable<any> {
    const body=new URLSearchParams();
    body.set('username',email);
    body.set('password',password);
    const headers=new HttpHeaders({
      'Content-Type':'application/x-www-form-urlencoded'
    });
    return this.http.post(`${this.loginUrl}`,body.toString(),{headers}).
    pipe(map(user=>{
      if(isPlatformBrowser(this.platformId)){
        localStorage.setItem('currentUser',JSON.stringify(user));
      }
      console.log("Login Successful");
      this.currentUserSubject.next(user);
      return user;
    }));
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
    return !!this.currentUserSubject.value.access_token;
  }
}