import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { GrowattData } from './growatt-data';

@Injectable({
  providedIn: 'root'
})
export class GrowattService {
  private apiUrl = 'https://rigelecserback.onrender.com/api/growatt/total';

  constructor(private http: HttpClient) { }

  getData(): Observable<GrowattData> {
    return this.http.get<GrowattData>(this.apiUrl).pipe(
      catchError(this.handleError<GrowattData>('getData'))
    );
  }

  private handleError<T>(operation = 'operation') {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(null as T);
    };
  }
}