import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartResizeService {
  private resizeSubject = new BehaviorSubject<boolean>(false);
  resize$ = this.resizeSubject.asObservable();

  // Tamaños mínimos para mantener la legibilidad
  private readonly MIN_WIDTH = 300;
  private readonly MIN_HEIGHT = 200;
  private readonly MAX_WIDTH = 1200;
  private readonly MAX_HEIGHT = 800;

  constructor() {
    // Escuchar cambios en el tamaño de la ventana
    window.addEventListener('resize', () => {
      this.resizeSubject.next(true);
    });
  }

  resizeChart(chart: Chart, container: HTMLElement) {
    if (!chart || !container) return;

    // Obtener dimensiones del contenedor
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calcular dimensiones óptimas manteniendo la proporción
    const aspectRatio = 16 / 9;
    let width = Math.min(Math.max(containerWidth, this.MIN_WIDTH), this.MAX_WIDTH);
    let height = Math.min(Math.max(width / aspectRatio, this.MIN_HEIGHT), this.MAX_HEIGHT);

    // Ajustar si la altura es demasiado grande para el contenedor
    if (height > containerHeight) {
      height = Math.min(containerHeight, this.MAX_HEIGHT);
      width = Math.min(height * aspectRatio, this.MAX_WIDTH);
    }

    // Ajustar si el ancho es demasiado grande para el contenedor
    if (width > containerWidth) {
      width = Math.min(containerWidth, this.MAX_WIDTH);
      height = Math.min(width / aspectRatio, this.MAX_HEIGHT);
    }

    // Actualizar dimensiones del canvas
    chart.canvas.width = width;
    chart.canvas.height = height;

    // Actualizar opciones del gráfico para mejor visualización en pantallas pequeñas
    chart.options = {
      ...chart.options,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...chart.options.plugins,
        legend: {
          ...chart.options.plugins?.legend,
          labels: {
            ...chart.options.plugins?.legend?.labels,
            boxWidth: Math.min(20, width / 50),
            font: {
              size: Math.min(16, width / 60),
              weight: 'bold'
            }
          }
        }
      }
    };

    // Actualizar el gráfico
    chart.resize();
  }

  // Método para limpiar el servicio cuando se destruye el componente
  destroy() {
    window.removeEventListener('resize', () => {
      this.resizeSubject.next(true);
    });
  }
} 