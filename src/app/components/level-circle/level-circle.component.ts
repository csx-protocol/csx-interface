import { Component, Input, OnChanges, SimpleChanges, } from '@angular/core';
import { Web3Service } from '../../shared/web3.service';

@Component({
  selector: 'app-level-circle',
  templateUrl: './level-circle.component.html',
  styleUrls: ['./level-circle.component.scss']
})
export class LevelCircleComponent implements OnChanges {
  @Input() percent: number = 20;
  @Input() radius: number = 66;
  @Input() outerStrokeWidth: number = 3;
  @Input() innerStrokeWidth: number = 4;
  @Input() outerStrokeColor: string = '#2a2c52';
  @Input() innerStrokeColor: string = 'rgb(18 19 31)';
  @Input() animation: boolean = true;
  @Input() animationDuration: number = 300;
  @Input() subtitle: string = '0x000000';
  @Input() title: string = 'ERROR';
  @Input() units: string = '';
  @Input() unitsColor: string = '#c4c7ef';
  @Input() titleColor: string = '#c4c7ef';
  @Input() subtitleColor: string = '#9295b3';
  @Input() subtitleFontSize: string = '12px';

  @Input() userAddress: string = '0x000000';

  constructor(private web3Service: Web3Service) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('LevelCircleComponent ngOnChanges', changes);
    console.log('this.userAddress', this.userAddress);   
    if(changes.hasOwnProperty('userAddress')){
      this.getLevel();
    }
  }

  getLevel() {
    if (this.userAddress == '0x000000' || this.userAddress == '' || this.userAddress == undefined || this.userAddress == null) {
      this.title = 'ERROR';
    } else {
      this.web3Service.getProfileLevel(this.userAddress).then((level: number) => {
        console.log('LevelCircleComponent getLevel', level);
        // For testing purposes only, for every second, increase one level
        // level = 5;
        setInterval(() => {
          level++;
          this.title = 'LEVEL ' + level;
          this.innerStrokeColor = this.getInnerStrokeColor(level);
          this.outerStrokeColor = this.getOuterStrokeColor(level);
          this.percent = this.getProgress(level);
        }, 1000);

        this.title = 'LEVEL ' + level;
        this.innerStrokeColor = this.getInnerStrokeColor(level);
        this.outerStrokeColor = this.getOuterStrokeColor(level);
        this.percent = this.getProgress(level);
      });
      this.subtitle = this.getTrimmedAddress(this.userAddress);
    }
  }

  onClick(){
    const isOwner = this.userAddress == this.web3Service.webUser.address ? true : false;
    // Open Dialog for Level Up
  }

  getTrimmedAddress(address: string) {
    return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
  }

  getInnerStrokeColor(level: number): string {
    const levelGroup = Math.floor(level / 10);
    const colors = [
      '#2a2c52', // 1-9
      '#c0392b', // red:ish
      '#d35400', // orange:ish
      '#f1c40f', // yellow:ish
      '#27ae60', // darkGreen:ish
      '#2980b9', // blue:ish
      '#8e44ad', // purple:ish
      '#e84393', // pink:ish
      '#641e16', // vinered:ish
      '#c5a880', // sand:ish
      '#a5a5a5', // darkwhite:ish
    ];
  
    const colorIndex = levelGroup % colors.length;
    return colors[colorIndex];
  }
  
  getOuterStrokeColor(level: number): string {
    const levelGroup = Math.floor(level / 10);
    const colors = [
      '#c0392b', // red:ish
      '#d35400', // orange:ish
      '#f1c40f', // yellow:ish
      '#27ae60', // darkGreen:ish
      '#2980b9', // blue:ish
      '#8e44ad', // purple:ish
      '#e84393', // pink:ish
      '#641e16', // vinered:ish
      '#c5a880', // sand:ish
      '#a5a5a5', // darkwhite:ish
 
      '#2a2c52', // 1-9
    ];
  
    let colorIndex = levelGroup % colors.length;
  
    // If the level is a multiple of 10 and even, use the previous color
    if (level % 10 === 0) {
      colorIndex = (colorIndex - 1 + colors.length) % colors.length;
    }
  
    return colors[colorIndex];
  }

  // getInnerStrokeColor(level: number): string {
  //   const levelGroup = Math.floor(level / 10);
  //   const colors = [
  //     '#2a2c52', // 1-9
  //     '#c0392b', // red:ish
  //     '#d35400', // orange:ish
  //     '#f1c40f', // yellow:ish
  //     '#27ae60', // darkGreen:ish
  //     '#2980b9', // blue:ish
  //     '#8e44ad', // purple:ish
  //     '#e84393', // pink:ish
  //     '#641e16', // vinered:ish
  //     '#c5a880', // sand:ish
  //     '#a5a5a5', // darkwhite:ish
  //   ];
  
  //   const colorIndex = levelGroup % colors.length;
  //   return colors[colorIndex];
  // }
  
  // getOuterStrokeColor(level: number): string {
  //   const adjustedLevel = level + 1;
  //   const levelGroup = Math.floor(adjustedLevel / 10);
  //   const colors = [
  //     '#2a2c52', // 1-9
  //     '#c0392b', // red:ish
  //     '#d35400', // orange:ish
  //     '#f1c40f', // yellow:ish
  //     '#27ae60', // darkGreen:ish
  //     '#2980b9', // blue:ish
  //     '#8e44ad', // purple:ish
  //     '#e84393', // pink:ish
  //     '#641e16', // vinered:ish
  //     '#c5a880', // sand:ish
  //     '#a5a5a5', // darkwhite:ish
  //   ];
  
  //   const colorIndex = levelGroup % colors.length;
  //   return colors[colorIndex];
  // }
  
  
// Calculate the percentage of the circle by the progress to each 10th level, and if the level is 0, 10, 20, 30, etc then return 100%
getProgress(level: number): number {
  if (level % 10 === 0) {
    return 100;
  }

  const levelGroup = Math.floor(level / 10);
  const levelGroupProgress = level % 10;
  const progress = levelGroupProgress * 10;
  return progress;
}

  

}
