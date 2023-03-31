import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-float-bar',
  templateUrl: './float-bar.component.html',
  styleUrls: ['./float-bar.component.scss'],
})
export class FloatBarComponent implements OnChanges {
  @Input() min: number = 0.38;
  @Input() max: number = 0.45;
  @Input() value: number = 0.4448215067386627;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('min') || changes.hasOwnProperty('max') || changes.hasOwnProperty('current')) {
      this.setValue();
    }
  }

  @ViewChild('floatProgressBar', { static: true }) floatProgressBar?: ElementRef;
  setValue() {
    const bar = this.floatProgressBar?.nativeElement;
    if (bar) {
      bar.querySelector(':scope > div:nth-child(6)').style.left = (this.min * 100) + '%';
      bar.querySelector(':scope > div:nth-child(7)').style.left = (this.max * 100) + '%';
      bar.querySelector(':scope > div:nth-child(8)').style.left = (this.value * 100) + '%';
    }
  }

}
