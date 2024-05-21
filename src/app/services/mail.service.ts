import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mail } from '../classes/mail.model';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  urlMail: string = "http://localhost:3000/usuario/mail";

  constructor(private http : HttpClient) { }

  public enviarMail(mail : Mail){
    return this.http.post<any>(this.urlMail, mail);
  }
}
