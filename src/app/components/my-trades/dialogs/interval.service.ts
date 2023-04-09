import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IntervalService {
  // array of stored intervals
  intervals: any[] = [];
  
  createInterval(contractAddress: string, callback: Function) {
    const interval = setInterval(async () => {
      callback();
    }, 1000);
    this.intervals.push({ contractAddress, interval });  
  }

  stopInterval(contractAddress: string) {
    const interval = this.intervals.find(i => i.contractAddress === contractAddress);
    if(interval) {
      clearInterval(interval.interval);
      this.intervals = this.intervals.filter(i => i.contractAddress !== contractAddress);
    }
  }

  stopAllIntervals() {
    this.intervals.forEach(i => {
      clearInterval(i.interval);
    });
    this.intervals = [];
  }

  showAllIntervals() {
    console.log('this.intervals', this.intervals);
  }
}

