import { Component } from '@angular/core';
import { Web3Service } from '../../shared/web3.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { EscrowDialog } from './utils/escrow.dialog';

@Component({
  selector: 'app-mint-escrow',
  templateUrl: './mint-escrow.component.html',
  styleUrls: ['./mint-escrow.component.scss']
})
export class MintEscrowComponent {

  constructor(
    public web3: Web3Service, 
    private notify: NotificationService, 
    private dialog: MatDialog
    ) { }


  openEscrowDialog() {
    const csxWeiBalance = this.web3.webUser.balances!['CSX'].balanceWei;
    if (csxWeiBalance == '0') {
      this.notify.openSnackBar('You have no CSX to escrow 😭', 'OK');
      return;
    }

    const dialogRef = this.dialog.open(EscrowDialog, {
      data: 'Escrow',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
