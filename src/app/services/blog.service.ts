import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BlogPost {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  contentImages: string[];  // Add this line
  category: 'project' | 'article';
  date: string;
  tags: string[];
  powerOutput?: string;
  panelsInstalled?: number;
  costSavings?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'https://rigelecserback.onrender.com/api/post';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.apiUrl);
  }

  getPostById(id: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/${id}`);
  }
  deletePost(postId: number, authCode: string): Observable<void> {
    const headers = new HttpHeaders().set('authCode', authCode); // Send authCode in the request header
    return this.http.delete<void>(`${this.apiUrl}/${postId}`, { headers });
  }
}