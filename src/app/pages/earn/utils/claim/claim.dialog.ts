import { trigger, state, style, transition, animate } from "@angular/animations";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NotificationService } from "src/app/shared/notification.service";
import { Web3Service } from "src/app/shared/web3.service";
import { StakeDialog } from "../stake/stake.dialog";
import { ThemePalette } from "@angular/material/core";

export interface Task {
    name: string;
    completed: boolean;
    color: ThemePalette;
    subtasks: Task[];
}

@Component({
    selector: 'claim-dialog',
    templateUrl: './claim.dialog.html',
    styleUrls: ['./claim.dialog.scss'],
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
export class ClaimDialog {

    task: Task = {
        name: 'Claim All Rewards',
        completed: false,
        color: 'primary',
        subtasks: [
            { name: 'USDC', completed: false, color: 'primary' } as Task,
            { name: 'USDT', completed: false, color: 'primary' } as Task,
            { name: 'WETH', completed: false, color: 'primary' } as Task,
            { name: 'WETH to ETH', completed: false, color: 'accent' } as Task,
        ]
    };

    constructor(
        public dialogRef: MatDialogRef<StakeDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private web3: Web3Service,
        private notify: NotificationService,
    ) { }

    allComplete: boolean = false;
    noneComplete: boolean = true;

    updateAllComplete(_task: Task) {
        this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
        this.noneComplete = this.task.subtasks != null && this.task.subtasks.every(t => !t.completed);
        if (_task.name == 'WETH to ETH' && !this.task.subtasks[2].completed) {
            this.task.subtasks[2].completed = this.task.subtasks[3].completed;
        }
    }

    someComplete(): boolean {
        if (this.task.subtasks == null) {
            return false;
        }
        this.noneComplete = this.task.subtasks != null && this.task.subtasks.every(t => !t.completed);
        return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
    }

    setAll(completed: boolean) {
        this.allComplete = completed;
        if (this.task.subtasks == null) {
            return;
        }
        this.task.subtasks.forEach(t => (t.completed = completed));
    }

    isClaiming: boolean = false;
    claimRewards() {

        if (this.noneComplete) {
            this.notify.openSnackBar('Please select at least one reward to claim', 'OK');
            return;
        }

        this.isClaiming = true;
        const USDCveridict = this.task.subtasks[0].completed;
        const USDTveridict = this.task.subtasks[1].completed;
        const WETHveridict = this.task.subtasks[2].completed;
        const WETHtoETHveridict = this.task.subtasks[3].completed;



        // this.web3.claim(
        //     USDCveridict,
        //     USDTveridict,
        //     WETHveridict,
        //     WETHtoETHveridict
        // ).then((res: any) => {
        this.web3.callContractMethod(
            'StakedCSX',
            'claim',
            [
                USDCveridict,
                USDTveridict,
                WETHveridict,
                WETHtoETHveridict
            ],
            'send'
        ).then((res: any) => {
            if (res) {
                this.notify.openSnackBar('Rewards claimed successfully 🎉', 'OK');
                this.isClaiming = false;

                if (USDCveridict) {
                    this.web3.increaseBalance('USDC', this.data[2][0]);
                }

                if (USDTveridict) {
                    this.web3.increaseBalance('USDT', this.data[2][1]);
                }

                if (WETHveridict && WETHtoETHveridict) {
                    this.web3.increaseBalance('ETH', this.data[2][2]);
                } else if (WETHveridict) {
                    this.web3.increaseBalance('WETH', this.data[2][2]);
                }

                this.dialogRef.close([USDCveridict, USDTveridict, WETHveridict, WETHtoETHveridict]);
                return;
            }
            throw new Error('Error claiming rewards', res);
        }).catch((err: any) => {
            console.error(err);
            this.notify.openSnackBar(err.message, 'OK');
            this.isClaiming = false;
            this.dialogRef.close();
        });
    }
}