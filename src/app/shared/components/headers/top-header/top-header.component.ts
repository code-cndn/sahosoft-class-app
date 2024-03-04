import { Component, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { NavHeaderComponent } from '../nav-header/nav-header.component';
import { AuthService } from '../../../../views/auth/auth.service';
import { RouterLink } from '@angular/router';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { LoginComponent } from '../../../../views/auth/login/login.component';
import { CryptoService } from '../../../crypto.service';

@Component({
  selector: 'app-top-header',
  standalone: true,
  imports: [NavHeaderComponent, RouterLink,MatDialogModule],
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.scss'
})
export class TopHeaderComponent implements OnInit, OnChanges{
  _crypto = inject(CryptoService);
  ngOnChanges(changes: SimpleChanges): void {
    this.userDetails = JSON.parse(this._crypto.getStorage("SYSUSER_DT"));
  }
  _authService = inject(AuthService);
  dialog= inject(MatDialog);
  userDetails: any;
  
  ngOnInit(): void {
  }
  getUserDetails(){
    return JSON.parse(this._crypto.getStorage("SYSUSER_DT"));
  }
  
 openLoginModel(){
  const dialogRef = this.dialog.open(LoginComponent, {
    data: { isOpen: true },
  });
  dialogRef.afterClosed().subscribe(result => {
    // console.log(`Dialog result: ${result}`);
  });
 }
  logout() {
    this._authService.logout();
  }

}
