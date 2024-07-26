import { Injectable } from '@angular/core';
import { environment } from 'src/enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public url = `${environment.apiUrl}`;

  constructor() { }
}
