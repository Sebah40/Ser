import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AuthRequest {
  code: string;
}

interface AuthResponse {
  message: string;
}

interface CreatePostRequest {
  authCode: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  contentImages: string[];  
  category: 'proyecto' | 'artículo';
  date: string;
  tags: string[];
  powerOutput?: string | null;
  panelsInstalled?: number | null;
  costSavings?: string | null;
}

interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  contentImages: string[];  
  category: string;
  date: string;
  tags: string[];
  author: string;  
  powerOutput?: string;
  panelsInstalled?: number;
  costSavings?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogCreateService {
  private apiUrl = 'https://rigelecserback.onrender.com/api/auth';
  private postsUrl = 'https://rigelecserback.onrender.com/api';

  constructor(private http: HttpClient) {}

  verifyAuth(code: string): Observable<AuthResponse> {
    const request: AuthRequest = { code };
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify`, request);
  }

  verifyAndCreatePost(postData: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/verify-and-create`, postData);
  }

  updateContentImages(postId: number, imageUrls: string[]): Observable<Post> {
    return this.http.patch<Post>(`${this.postsUrl}/${postId}/content-images`, imageUrls);
  }

  getContentImages(postId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.postsUrl}/${postId}/content-images`);
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload-image`, formData);
  }

  deleteContentImage(postId: number, imageUrl: string): Observable<void> {
    return this.http.delete<void>(`${this.postsUrl}/${postId}/content-images`, {
      params: { url: imageUrl }
    });
  }

  updatePost(postId: number, postData: Partial<CreatePostRequest>): Observable<Post> {
    return this.http.put<Post>(`${this.postsUrl}/auth/verify-and-update/${postId}`, postData);
  }
}