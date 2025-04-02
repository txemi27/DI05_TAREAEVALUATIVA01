import { Component, OnInit, Renderer2, ElementRef, Input, OnDestroy } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { GestionApiService } from 'src/app/services/gestion-api.service';
import { ChartResizeService } from 'src/app/services/chart-resize.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  standalone: false
})
export class BarChartComponent implements OnInit, OnDestroy {
 
  @Input() datosCategorias: number[] = [];
  @Input() nombresCategorias: string[] = [];
  @Input() backgroundColorCategorias: string[] = [];
  @Input() borderColorCategorias: string[] = [];
  @Input() tipoChartSelected: string = "";

  public chart!: Chart;
  public apiData: { categoria: string; totalResults: number }[] = [];
  private container!: HTMLElement;

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2, 
    private gestionServiceApi: GestionApiService,
    private chartResizeService: ChartResizeService
  ) {}
 
  ngOnInit(): void {
    console.log("Ejecuta bar-chart");
    this.container = this.el.nativeElement.querySelector('#contenedor-barchart');
    this.inicializarChart();

    // Suscribirse a cambios de tamaño
    this.chartResizeService.resize$.subscribe(() => {
      if (this.chart) {
        this.chartResizeService.resizeChart(this.chart, this.container);
      }
    });

    // Suscribirse a datos de la API
    this.gestionServiceApi.datos$.subscribe((datos) => {
      if (datos != undefined) {
        this.apiData.push(datos);
        this.actualizarChart();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private inicializarChart() {
    const datasetsByCompany: { [key: string]: { label: string; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number } } = {};

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
    this.renderer.appendChild(this.container, canvas);

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

    // Redimensionar inicialmente
    this.chartResizeService.resizeChart(this.chart, this.container);
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