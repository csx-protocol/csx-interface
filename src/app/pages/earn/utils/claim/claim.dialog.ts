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
    disabled?: boolean;
    subtasks?: Task[];
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
            { name: 'USDC', completed: false, color: 'primary'},
            { name: 'USDT', completed: false, color: 'primary'},
            { name: 'WETH', completed: false, color: 'primary'},
            { name: 'WETH to ETH', completed: false, color: 'accent'},
        ]
    };

    constructor(
        public dialogRef: MatDialogRef<StakeDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private web3: Web3Service,
        private notify: NotificationService,
    ) { }

    allComplete: boolean = false;

    updateAllComplete() {
        this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    }

    someComplete(): boolean {
        if (this.task.subtasks == null) {
            return false;
        }
        return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
    }

    setAll(completed: boolean) {
        this.allComplete = completed;
        if (this.task.subtasks == null) {
            return;
        }
        this.task.subtasks.forEach(t => (t.completed = completed));
    }

    claimRewards() {

    }
}