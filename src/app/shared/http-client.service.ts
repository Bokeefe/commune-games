import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


// libraries
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:3000/';
  }

  GET(url: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(this.baseUrl + url, {
      responseType: 'text',
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      })
    })
      .pipe(
        map((res) => {
            return res;
          }
        ),
        catchError((error) => {
            return throwError(error);
          }
        )
      );
  }

  POST(url, formData: Object): Observable<any> {
    return this.http.post(this.baseUrl + url, formData)
      .pipe(
        map((res) => {
            return res;
          }
        ),
        catchError((error) => {
            return throwError(error);
          }
        )
      );
  }

}
