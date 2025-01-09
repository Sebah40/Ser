import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface for auth request
interface AuthRequest {
  code: string;
}

// Interface for auth response
interface AuthResponse {
  message: string;
}

// Interface for post data
interface CreatePostRequest {
  authCode: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: 'proyecto' | 'artículo';
  date: string;
  tags: string[];
  powerOutput?: string | null;
  panelsInstalled?: number | null;
  costSavings?: string | null;
}

// Interface for created post response
interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  category: string;
  date: string;
  tags: string[];
  powerOutput?: string;
  panelsInstalled?: number;
  costSavings?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogCreateService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  verifyAuth(code: string): Observable<AuthResponse> {
    const request: AuthRequest = { code };
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify`, request);
  }

  verifyAndCreatePost(postData: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/verify-and-create`, postData);
  }
}