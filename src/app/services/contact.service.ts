import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces for type safety

export interface EmailResponse {
  success: boolean;
  message: string;
}

export interface QuizResults {
  solution: {
    type: string;
    title: string;
    description: string;
    benefits: string[];
  };
  scores: {
    offGrid: number;
    onGrid: number;
    bombeo: number;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
    comments?: string;
  };
  answers: { questionId: number, selectedOption: string }[];  // Add the answers field
}


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'https://rigelecserback.onrender.com/api/contact/send-quiz-results'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  sendQuizResults(data: QuizResults): Observable<EmailResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
  
    // Prepare the request body with the correct structure
    const requestBody = {
      solution: data.solution,  // Directly use the solution object
      scores: data.scores,      // Directly use the scores object
      contact: data.contact,    // Directly use the contact object
      answers: data.answers.map(answer => ({
        questionId: answer.questionId, // Map to send correct structure
        selectedOption: answer.selectedOption // Include selected option text
      }))
    };
  
    // Send the request to the backend
    return this.http.post<EmailResponse>(`${this.apiUrl}`, requestBody, { headers });
  }

  private formatEmailContent(data: QuizResults): string {
    const answersContent = data.answers.map(answer => {
      return `Pregunta ${answer.questionId}: ${answer.selectedOption}`;
    }).join('\n');
  
    return `
      Nueva consulta del calculador solar:
  
      Información del Cliente:
      ----------------------
      Nombre: ${data.contact.name}
      Email: ${data.contact.email}
      Teléfono: ${data.contact.phone}
      ${data.contact.comments ? `Comentarios: ${data.contact.comments}` : ''}
  
      Resultado del Cuestionario:
      -------------------------
      Solución Recomendada: ${data.solution.title}
      Tipo de Sistema: ${data.solution.type}
  
      Puntuación:
      - Off Grid: ${data.scores.offGrid}
      - On Grid: ${data.scores.onGrid}
      - Bombeo Solar: ${data.scores.bombeo}
  
      Beneficios Principales:
      ${data.solution.benefits.map(benefit => `- ${benefit}`).join('\n')}
  
      Descripción:
      ${data.solution.description}
  
      Respuestas del Cuestionario:
      ----------------------------
      ${answersContent}
  
      Este email fue generado automáticamente por el calculador solar.
    `;
  }

  // Optional: Add method to validate email
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Optional: Add method to validate phone
  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone);
  }

  // Optional: Add method to sanitize user input
  sanitizeInput(input: string): string {
    return input.replace(/<[^>]*>/g, ''); // Basic HTML sanitization
  }
}