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
  contentImages: string[];  // Array of image URLs
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
  contentImages: string[];  // Array of strings
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
  private apiUrl = 'https://rigelecserback.onrender.com/api/auth';
  private postsUrl = 'https://rigelecserback.onrender.com/api';

  constructor(private http: HttpClient) {}

  verifyAuth(code: string): Observable<AuthResponse> {
    const request: AuthRequest = { code };
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify`, request);
  }

  verifyAndCreatePost(postData: CreatePostRequest): Observable<Post> {
    // No need to transform contentImages as they're already strings
    return this.http.post<Post>(`${this.apiUrl}/verify-and-create`, postData);
  }

  updateContentImages(postId: number, imageUrls: string[]): Observable<Post> {
    // Send array of strings directly
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
    // Changed to use imageUrl instead of imageId
    return this.http.delete<void>(`${this.postsUrl}/${postId}/content-images`, {
      params: { url: imageUrl }
    });
  }

  updatePost(postId: number, postData: Partial<CreatePostRequest>): Observable<Post> {
    // No need to transform contentImages
    return this.http.put<Post>(`${this.postsUrl}/${postId}`, postData);
  }
}