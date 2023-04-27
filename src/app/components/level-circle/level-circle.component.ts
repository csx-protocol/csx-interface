import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Web3Service } from '../../shared/web3.service';
import { environment } from 'src/environment/environment';
import { MatDialog } from '@angular/material/dialog';
import { LevelUpDialog } from './utils/level-up.dialog';

// class UserTradeDetails {
//   contractAddress: string;
// }

@Component({
  selector: 'app-level-circle',
  templateUrl: './level-circle.component.html',
  styleUrls: ['./level-circle.component.scss'],
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
  @Input() title: string = 'LOADING...';
  @Input() units: string = '';
  @Input() unitsColor: string = '#c4c7ef';
  @Input() titleColor: string = '#c4c7ef';
  @Input() subtitleColor: string = '#9295b3';
  @Input() subtitleFontSize: string = '12px';

  @Input() userAddress: string = '0x000000';
  @Input() displayTradeDetails: boolean = false;
  @Input() reactOnClick: boolean = true;

  constructor(private web3Service: Web3Service,  private dialog: MatDialog) { }

  firstTime: boolean = true;
  ngOnChanges(changes: SimpleChanges): void {

    if (changes.hasOwnProperty('userAddress')) {
      this.getLevel();
      this.getTradeDetails();
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
        // setInterval(() => {
        //   level++;
        //   this.title = 'LEVEL ' + level;
        //   this.innerStrokeColor = this.getInnerStrokeColor(level);
        //   this.outerStrokeColor = this.getOuterStrokeColor(level);
        //   this.percent = this.getProgress(level);
        // }, 1000);

        this.title = 'LEVEL ' + level;
        this.innerStrokeColor = this.getInnerStrokeColor(level);
        this.outerStrokeColor = this.getOuterStrokeColor(level);
        this.percent = this.getProgress(level);
      });
      this.subtitle = this.getTrimmedAddress(this.userAddress);
    }
  }

  reputationNeg: number = 0;
  reputationPos: number = 0;
  totalTradesAsSeller: number = 0;
  totalTradesAsBuyer: number = 0;
  totalTrades: number = 0;
  avgDeliveryTime: string = '0';
  isInMinutes: boolean = false;

  getTradeDetails() {
    if (this.displayTradeDetails) {
      this.web3Service.getUserDataFromUsers(this.userAddress).then((tradeDetails: any) => {
        // console.log('LevelCircleComponent getTradeDetails', tradeDetails);
        this.reputationNeg = tradeDetails.reputationNeg;
        this.reputationPos = tradeDetails.reputationPos;
        this.totalTradesAsSeller = tradeDetails.totalTradesAsSeller;
        this.totalTradesAsBuyer = tradeDetails.totalTradesAsBuyer;
        this.totalTrades = parseInt(tradeDetails.totalTradesAsBuyer) + parseInt(tradeDetails.totalTradesAsSeller);

        const epochTime: number = parseInt(tradeDetails.deliveryInfo.averageDeliveryTime);

        //If average delivery time is less than 1 hour, display in minutes
        if (epochTime < 3600) {
          this.avgDeliveryTime = (epochTime / 60).toString();
          this.isInMinutes = true;
          return;
        }
        this.avgDeliveryTime = (epochTime / 60 / 60).toString();
      });
    }
  }

  async onClick() {
    if(this.reactOnClick){
      const isOwner = this.userAddress == this.web3Service.webUser.address ? true : false;
      console.log('LevelCircleComponent onClick isOwner?:', isOwner);
      // Open Dialog for Level Up
      if (isOwner) {
        this.web3Service.getUserDataFromProfileLevel(this.userAddress).then((levels: any) => {
          this.openDialog(levels);     
        });
      }
    }
  }

  openDialog(_data: any): void {   
    const dialogRef = this.dialog.open(LevelUpDialog, {
      data: _data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if(result > 0){
        this.getLevel();
      }
    });
  }

  getTrimmedAddress(address: string) {
    return address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
  }

  getInnerStrokeColor(level: number): string {
    const levelGroup = Math.floor(level / 10);
    const colors = [
      '#2a2c52', // 1-9
      '#c0392b', // red:ish
      '#ff9b01', // orange:ish
      '#f1c40f', // yellow:ish
      '#27ae60', // darkGreen:ish
      '#2980b9', // blue:ish
      '#8e44ad', // purple:ish
      '#e84393', // pink:ish
      '#5b2c2f', // vinered:ish
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
      '#ff9b01', // orange:ish
      '#f1c40f', // yellow:ish
      '#27ae60', // darkGreen:ish
      '#2980b9', // blue:ish
      '#8e44ad', // purple:ish
      '#e84393', // pink:ish
      '#5b2c2f', // vinered:ish
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
