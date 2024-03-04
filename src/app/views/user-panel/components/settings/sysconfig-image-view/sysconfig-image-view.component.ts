import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-sysconfig-image-view',
  standalone: true,
  imports: [],
  templateUrl: './sysconfig-image-view.component.html',
  styleUrl: './sysconfig-image-view.component.scss'
})
export class SysconfigImageViewComponent {
  imagePath = environment.BASE_SYSTEMCONFIG_IMAGE;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SysconfigImageViewComponent>,) {

  }
}
