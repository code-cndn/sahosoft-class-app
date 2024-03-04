import { Component, OnInit, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CryptoService } from '../../../../shared/crypto.service';
import { HttpService } from '../../../../shared/http.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SysconfigImageViewComponent } from './sysconfig-image-view/sysconfig-image-view.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatTabsModule, MatExpansionModule, RouterLink, DatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent implements OnInit {
  _router = inject(Router);
  _crypto = inject(CryptoService);
  _http = inject(HttpService);
  dialog = inject(MatDialog)
  panelOpenState = false;
  userDetails: any;
  objCourses: any[] = [];
  imagePath = environment.BASE_SYSTEMCONFIG_IMAGE;
  currentDeviceId:any;
  ngOnInit(): void {
    this.currentDeviceId = this._crypto.getStorage("VISITOR")
    this.userDetails = JSON.parse(this._crypto.getStorage("SYSUSER_DT"));
    this._http.post(environment.BASE_API_PATH + "PurchasePlan/GetAllPurchaseCourseDetailsByUserId", { userId: this.userDetails.userId }).subscribe(res => {
      if (res.isSuccess) {
        let course = res.data.filter(x => x.batchId != 0);

        this._http.post(environment.BASE_API_PATH_MYCLASS + "MyClass_PlayOnlinePaidVideo/PlayOnlinePaidVideo_GetByUserId", { userId: this.userDetails.userId })
          .subscribe(res => {
            let temp = [];
            if (res.isSuccess) {
              let config = [];
              for (let data of course) {
                if (data){
                  let d = res.data.find(x => (x.courseId == data.itemId && x.batchId == data.batchId) && x.isReIssue == 0);
                  if(d)
                  config.push(d)
                }
              }
              for (let c of config) {
                let data = course.find(x => x.itemId == c.courseId && c.deviceId !=0)
                if (data) {
                  data.configDate = c.modifiedOn
                  data.configData = c;
                  temp.push(data)
                }


              }
              temp.sort((a, b) => {
                const dateA = new Date(a.configDate).getTime();
                const dateB = new Date(b.configDate).getTime();
                return dateB - dateA;
              });
              this.objCourses = temp;

              
              
            }
          })
      }
    })
  }
  // 
  openImageViewModel(item: any) {
    this.dialog.open(SysconfigImageViewComponent, {
      data: {
        configData: item.configData.systemScreenshotPath
      },
    });
  }

  goBack() {
    this._router.navigate(['settings']);
  }
}
