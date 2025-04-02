import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
import { GestionApiService } from '../services/gestion-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  // Mantener las variables existentes de los gráficos
  tipoDeChartSeleccionado: string = 'bar-chart';
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

  apiKey: string = environment.apiKey;
  apiUrl: string = environment.apiUrl;


  // Añadir los nuevos datos
  datosTablaTab1 = [
    { nombre: 'Juan', apellido: 'garcia', pais: "españa", edad: 30 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'Pedro', apellido: 'ruiz', pais: "españa", edad: 40 },
    { nombre: 'Juan', apellido: 'garcia', pais: "españa", edad: 30 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'Pedro', apellido: 'ruiz', pais: "españa", edad: 40 },
    { nombre: 'Juan', apellido: 'garcia', pais: "españa", edad: 30 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
    { nombre: 'Pedro', apellido: 'ruiz', pais: "españa", edad: 40 }

  ];

  datosLista = [
    "Esta será la línea 1 de la lista, vamos a poner un texto muy largo para ver qué es lo que hace en estos casos y como podemos corregirlo",
    "Esta será la línea 2 de la lista, será más corta que la anterior, pero entrará bastante justo en el ancho A4.",
    "Esta será la línea 3 de la lista, este entra bien",
    "Esta será la línea 4 de la lista, este entra bien",
    "Esta será la línea 5 de la lista, este entra bien",
    "Esta será la línea 6 de la lista, este entra bien",
    "Esta será la línea 7 de la lista, este entra bien",
    "Esta será la línea 8 de la lista, este entra bien",
    "Esta será la línea 9 de la lista, este entra bien",
    "Esta será la línea 10 de la lista, este entra bien",
    "Esta será la línea 11 de la lista, este entra bien",
    "Esta será la línea 12 de la lista, este entra bien",
    "Esta será la línea 13 de la lista, este entra bien",
    "Esta será la línea 14 de la lista, este entra bien",
    "Esta será la línea 15 de la lista, este entra bien",
    "Esta será la línea 16 de la lista, este entra bien",
    "Esta será la línea 17 de la lista, este entra bien",
    "Esta será la línea 18 de la lista, este entra bien",
    "Esta será la línea 19 de la lista, este entra bien",
    "Esta será la línea 20 de la lista, este entra bien",

  ];

  @ViewChild('container') container!: ElementRef;

  constructor(private gestionServiceApi: GestionApiService) {}

  ngOnInit() {
    // Llamamos a la API una vez por cada categoría al iniciar
    this.categorias.forEach(categoria => {
      this.gestionServiceApi.cargarCategoria(categoria);
    });
  }

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

  generarPDF() {
    const anchoMax = 794; //794px; //210mm
    const altoMax = 1123; //1123px; //297mm
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [anchoMax, altoMax]
    });
    
    const sections = this.container.nativeElement.querySelectorAll('.seccion') as NodeListOf<HTMLElement>;
    const totalSections = sections.length;
    let currentSectionIndex = 0;
    let contSections = 0;
    let headerHeight = 55;
    let footerHeight = 10;
    let currentPageHeight = headerHeight + footerHeight;

    while (currentSectionIndex < totalSections) {
      const section = sections[currentSectionIndex];
      html2canvas(section).then(canvas => {
        const imageData = canvas.toDataURL('image/jpg');
        const width = doc.internal.pageSize.getWidth();
        const height = canvas.height * (width / canvas.width);
        
        if (currentPageHeight + height >= doc.internal.pageSize.getHeight()) {
          doc.addPage();
          currentPageHeight = headerHeight + footerHeight;
        }
        
        doc.addImage(imageData, 'JPG', 0, currentPageHeight - footerHeight, width, height);
        currentPageHeight += height;
        contSections++;
        
        if (contSections === totalSections) {
          this.addPageConfig(doc);
          doc.save('dashboard.pdf');
        }
      });
      currentSectionIndex++;
    }
  }

  addPageConfig(doc: jsPDF) {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= doc.getNumberOfPages(); i++) {
      doc.setPage(i);
      this.addHeader(doc);
      this.addFooter(doc, i, totalPages);
    }
  }

  private addHeader(doc: jsPDF) {
    // Fondo del header
    doc.setFillColor('#CCCCCC');
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 55, 'F');
    
    // Logo centrado 
    const imagen = "/assets/images/company-logo.png";
    const imgWidth = 45;
    const imgHeight = 45;
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgX = (pageWidth - imgWidth) / 2; 
    const imgY = 5;
    doc.addImage(imagen, "PNG", imgX, imgY, imgWidth, imgHeight);
    
    // Información de la empresa
    doc.setFontSize(10);
    const nombreEmpresa = "GraficWorld";
    const telefono = "Teléfono: +34 659 842 2157";
    const direccion = "Dirección: Calle de la inventada 12, 35";
    doc.text(nombreEmpresa, 10, 15);
    doc.text(telefono, 10, 30);
    doc.text(direccion, 10, 45);
    
    // Línea separadora
    doc.line(0, 55, doc.internal.pageSize.width, 55);
  }

  private addFooter(doc: jsPDF, currentPage: number, totalPages: number) {
    // Footer 
    doc.setFillColor('#CCCCCC');
    const footerHeight = 20; // Altura de la barra gris
    const footerY = doc.internal.pageSize.getHeight() - footerHeight;
    doc.rect(0, footerY, doc.internal.pageSize.getWidth(), footerHeight, 'F');
    
    // Texto en el footer
    doc.setFontSize(10);
    const pageText = `Página ${currentPage} de ${totalPages}`;
    const textWidth = doc.getStringUnitWidth(pageText) * doc.getFontSize();
    const textX = (doc.internal.pageSize.getWidth() - textWidth) / 2;
    const textY = footerY + 14; // Centrada verticalmente barra gris
    doc.text(pageText, textX, textY);
  }
}