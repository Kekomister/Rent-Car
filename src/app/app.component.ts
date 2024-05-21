import { Component } from '@angular/core';
import { ConexionService } from './services/conexion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'car_front';

  constructor(public conexion : ConexionService){}

}
