import { Component, Inject, } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Web3Service } from "../../../shared/web3.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { environment } from "../../../../environment/environment";
import { NotificationService } from "../../../shared/notification.service";

@Component({
    selector: 'level-up-dialog',
    templateUrl: './level-up.dialog.html',
    styleUrls: ['./level-up.dialog.scss'],
    animations: [
        trigger('cardAnimation', [
            state('in', style({ opacity: 1, transform: 'scale(1)' })),
            transition('void => *', [
                style({ opacity: 0, transform: 'scale(0.5)' }),
                animate(150),
            ]),
            transition('* => void', [
                animate(150, style({ opacity: 0, transform: 'scale(0.5)' })),
            ]),
        ]),
    ],
})
export class LevelUpDialog {
    state = 'in'; // for animation
    data: any;

    newLevelsMade: number = 0;

    isLevelingUp: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<LevelUpDialog>,
        @Inject(MAT_DIALOG_DATA) public _data: any, 
        public web3: Web3Service,
        private notice: NotificationService
    ) {
        this.data = _data;

        this.currentLevel = parseInt(this._data[0]); 
        
        const backdropClick = this.dialogRef.backdropClick().subscribe(() => {
            backdropClick.unsubscribe();
            this.dialogRef.close(this.newLevelsMade);
        });
    }

    onNoClick(): void {
        this.dialogRef.close(this.newLevelsMade);
    }


    totalCost: number = 0;
    currentLevel: number = 0;
    selectedLevels: number = 0;

    calculateCost() {
        const web3Utils = this.web3.csxInstance.window.web3.utils;
        const BASE_COST = web3Utils.toBN('1000000000000000000'); // 1e18
        
        const currentLevel = this.currentLevel;
    
        const targetLevel = this.selectedLevels;
    
        if (this.currentLevel >= targetLevel) {
            this.totalCost = 0;
            return;
        }
    
        let totalCost = web3Utils.toBN('0');
        for (let i = 1; i <= targetLevel - currentLevel; i++) {
            let cost = BASE_COST.add(web3Utils.toBN(currentLevel).add(web3Utils.toBN(i - 1)).mul(BASE_COST));
            totalCost = totalCost.add(cost);
        }
        const totalCostInWeiBN = new web3Utils.BN(totalCost);
        const totalCostInEther = web3Utils.fromWei(totalCostInWeiBN, 'ether');
        this.totalCost = totalCostInEther.toString();
    }
    
    formatLabel(value: number): string {
        if (value == 0) {
            return `My Next Level is ...`;
        } else {
            return `My Next Level is ${value}`;
        }

    }

    //allowanceCSX: number = 0;
    csxCost: string = '0';
    isApproving: boolean = false;
    isSigninTX: boolean = false;
    isLeveledUp: boolean = false;
    levelUp() {
        this.isLevelingUp = true;
        const csxBalance = this.web3.webUser.balances!['CSX'].balanceWei;
        const totalCostInWei =  this.web3.csxInstance.window.web3.utils.toWei(this.totalCost.toString(), 'ether');
        console.log('csxBalance', csxBalance);
        console.log('totalCostInWei', totalCostInWei);
        
        const csxBalanceBN = new this.web3.csxInstance.window.web3.utils.BN(csxBalance);
        const totalCostInWeiBN = new this.web3.csxInstance.window.web3.utils.BN(totalCostInWei);
    
        if (csxBalanceBN.lt(totalCostInWeiBN)) {
            this.isLevelingUp = false;
            this.notice.openSnackBar('You do not have enough CSX to level up', '🥹');
            return;
        }

        const newLevels = this.selectedLevels - this.currentLevel;
        this.web3.getCostForNextLevels(this.web3.webUser.address!, newLevels.toString()).then((cost) => {
            console.log('cost', cost);
            this.csxCost = cost;
        });

        this.web3.allowance('CSX', this.web3.webUser.address!, environment.CONTRACTS.UserProfileLevel.address).then((allowance) => {
            //this.allowanceCSX = allowance;
            console.log('allowance', allowance);
            console.log('totalCostInWei', totalCostInWei);
            
            const allowanceBN = new this.web3.csxInstance.window.web3.utils.BN(allowance);
            const totalCostInWeiBN = new this.web3.csxInstance.window.web3.utils.BN(totalCostInWei);

            if (allowanceBN.lt(totalCostInWeiBN)) {
                this.isApproving = true;
                this.web3.approve('CSX', environment.CONTRACTS.UserProfileLevel.address, totalCostInWei).then(() => {
                    this.isApproving = false;
                    this.levelUpProfileLevel();                    
                }).catch(() => {
                    this.isLevelingUp = false;
                    this.isApproving = false;
                });
            } else if(allowanceBN.gte(totalCostInWeiBN)) {
                this.levelUpProfileLevel();
            }
        }).catch(() => {
            this.isLevelingUp = false;
        });
    }

    reset() {
        this.isLevelingUp = false;
        this.isApproving = false;
        this.isSigninTX = false;
        this.isLeveledUp = false;
        this.selectedLevels = this.currentLevel;
        this.totalCost = 0;
        this.csxCost = '0';
    }

    levelUpProfileLevel() {
        this.isSigninTX = true;
        const newLevels: string = (this.selectedLevels-this.currentLevel).toString();
        this.web3.levelUpProfileLevel(newLevels).then(() => {
            this.isLevelingUp = false;
            this.isSigninTX = false;
            this.isLeveledUp = true;
            this.newLevelsMade += (this.selectedLevels-this.currentLevel)
            this.currentLevel += (this.selectedLevels-this.currentLevel);
            this.selectedLevels = this.currentLevel;
            const csxCostInEther = this.web3.csxInstance.window.web3.utils.fromWei(this.csxCost, 'ether');
            this.web3.decreaseBalance('CSX', csxCostInEther);     
        }).catch((error) => {
            this.isLevelingUp = false;
            this.isSigninTX = false;
            this.notice.openSnackBar(error.message, '🤦')
        });
    }

    addCommas(num: number | string): string {
        const [integerPart, decimalPart] = num.toString().split('.');
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Ensure that there are always two decimal places
        const formattedDecimal = decimalPart ? (decimalPart + '00').slice(0, 2) : '00';

        return `${formattedInteger}.${formattedDecimal}`;
    }


}
