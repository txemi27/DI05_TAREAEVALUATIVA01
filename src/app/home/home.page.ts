import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GestionApiService } from '../services/gestion-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  categorias: string[] = [
    "business",
    "entertainment",
    "general",
    "technology",
    "health",
    "science",
    "sports"
  ];

  backgroundColorCat: string[] = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 205, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(201, 203, 207, 0.2)'
  ];

  borderColorCat: string[] =[
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
  ];

  tipoDeChartSeleccionado: string = "bar-chart";

  apiKey: string = environment.apiKey;
  apiUrl: string = environment.apiUrl;

  constructor(private gestionServiceApi: GestionApiService) {}

  ngOnInit() {
    // Llamamos a la API una vez por cada categoría al iniciar
    this.categorias.forEach(categoria => {
      this.gestionServiceApi.cargarCategoria(categoria);
    });
  }

  // Gestionamos el cambio de segmento
  segmentChanged(event: any) {
    this.tipoDeChartSeleccionado = event.detail.value;
    // En caso de bar-chart, realizamos una llamada al api por cada categoría
    if (this.tipoDeChartSeleccionado == "bar-chart") {
      this.categorias.forEach(categoria => {
        this.gestionServiceApi.cargarCategoria(categoria);
      });
    }
    // Aquí podrías agregar lógica para manejar line-chart y pie-chart si es necesario
  }
}