import { Component, OnInit, Renderer2, ElementRef, Input } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { GestionApiService } from 'src/app/services/gestion-api.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  standalone: false
})
export class BarChartComponent implements OnInit {
 
  @Input() datosCategorias: number[] = [];
  @Input() nombresCategorias: string[] = [];
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];
  @Input() tipoChartSelected: string = "";

  public chart!: Chart;
  public apiData: { categoria: string; totalResults: number }[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2, private gestionServiceApi: GestionApiService) {}
 
  ngOnInit(): void {
    console.log("Ejecuta bar-chart");
    this.inicializarChart();

    // Nos suscribimos al observable de tipo BehaviorSubject
    this.gestionServiceApi.datos$.subscribe((datos) => {
      if (datos != undefined) {
        // Actualizamos apiData con los nuevos datos
        this.apiData.push(datos);
        this.actualizarChart(); // Llamamos al método para actualizar el gráfico
      }
    });
  }

  private inicializarChart() {

     // Tenemos que incializar los datassets para luego poder actualizarlos 
    const datasetsByCompany: { [key: string]: { label: string; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number } } = {};

    // Inicializamos los datasets por cada categoría
    this.nombresCategorias.forEach((categoria, index) => {
      datasetsByCompany[categoria] = {
        label: 'Valores de ' + categoria,
        data: [this.datosCategorias[index]],
        backgroundColor: [this.backgroundColorCategorias[index]],
        borderColor: [this.borderColorCategorias[index]],
        borderWidth: 1
      };
    });

    const data = {
      labels: this.nombresCategorias,
      datasets: Object.values(datasetsByCompany)
    };


    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'barChart');
    const container = this.el.nativeElement.querySelector('#contenedor-barchart');
    this.renderer.appendChild(container, canvas);

    this.chart = new Chart(canvas, {
      type: 'bar' as ChartType,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 20,
              font: {
                size: 16,
                weight: 'bold'
              }
            },
          }
        },
      }
    });

    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }

  private actualizarChart() {
    const datasetsByCompany: { [key: string]: { label: string; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number } } = {};

    this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
      const categoria = row.categoria;
      const totalResults = row.totalResults;

      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: 'Valores de ' + categoria,
          data: [],
          backgroundColor: [this.backgroundColorCategorias[index]],
          borderColor: [this.borderColorCategorias[index]],
          borderWidth: 1
        };
      }

      datasetsByCompany[categoria].data[index] = totalResults;
      datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCategorias[index];
      datasetsByCompany[categoria].borderColor[index] = this.borderColorCategorias[index];
    });

    this.chart.data.labels = this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria);
    this.chart.data.datasets = Object.values(datasetsByCompany);
    this.chart.update();
  }
}