import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styleUrls: ['./tablas.component.scss'],
  standalone: false
})
export class TablasComponent  implements OnInit {

  @Input() datosTabla: any[] = [];
      constructor() { }

  ngOnInit() {}

}
