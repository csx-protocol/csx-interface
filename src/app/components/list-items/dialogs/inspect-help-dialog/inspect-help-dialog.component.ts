import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-inspect-help-dialog',
  templateUrl: './inspect-help-dialog.component.html',
  styleUrls: ['./inspect-help-dialog.component.scss']
})
export class InspectHelpDialogComponent implements OnInit {
  rememberChoice = false;
  isInventoryOptionSelected = false;
  tradeLink = '';
  readonly USER_INVENTORY_LINK = 'https://steamcommunity.com/my/inventory/';
  readonly LEARN_HOW_TO_GET_INSPECT_LINK = 'https://steamcommunity.com/sharedfiles/filedetails/?id=3003114401';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly dialogRef: MatDialogRef<InspectHelpDialogComponent>

  ) {}

  ngOnInit(): void {
    this.checkPreviousChoice();
  }

  openLink(url: string): void {
    window.open(url, '_blank');
  }

  checkPreviousChoice(): void {
    this.tradeLink = this.data;
    const choice = localStorage.getItem('userChoice');
    if (choice === 'inventory') {
      this.isInventoryOptionSelected = true;
      this.openLink(this.USER_INVENTORY_LINK);
      this.dialogRef.close('inventory_auto');
    }
  }

  learnToGetInspectLink(): void {
    this.saveChoice('learn');
    this.openLink(this.LEARN_HOW_TO_GET_INSPECT_LINK);
  }

  goToInventory(): void {
    // Implementation for 'Take me to my inventory'
    this.saveChoice('inventory');
    this.openLink(this.USER_INVENTORY_LINK);
    this.dialogRef.close('inventory');
  }

  saveChoice(choice: string): void {
    if (this.rememberChoice) {
      localStorage.setItem('userChoice', choice);
      if (choice === 'inventory') {
        this.isInventoryOptionSelected = true;
      }
    }
  }
}
