import { Component, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '../../../../shared/http.service';
import { environment } from '../../../../../environments/environment';
import { UserSystemConfigComponent } from '../user-system-config/user-system-config.component';
import { AuthService } from '../../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../shared/common.service';
import { LoaderComponent } from '../../../../shared/components/other/loader/loader.component';
import Swal from 'sweetalert2';
import { DatePipe, Location } from '@angular/common';
import { CryptoService } from '../../../../shared/crypto.service';

@Component({
  selector: 'app-user-my-courses',
  standalone: true,
  imports: [RouterLink, UserSystemConfigComponent, LoaderComponent, DatePipe],
  templateUrl: './user-my-courses.component.html',
  styleUrl: './user-my-courses.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserMyCoursesComponent implements OnInit {
  _http = inject(HttpService);
  _router = inject(Router);
  _auth = inject(AuthService);
  _toaster = inject(ToastrService);
  _common = inject(CommonService);
  _location = inject(Location);
  _crypto = inject(CryptoService);


  userDetails: any;
  objCourses: any[] = [];
  userData: any;
  isOpenSysCongfig: boolean = false;
  devicedID: any;
  coursePath = environment.BASE_COURSES_PATH;
  ngOnInit(): void {
    this.userDetails = JSON.parse(this._crypto.getStorage("SYSUSER_DT"));
    this.devicedID = this._crypto.getStorage("VISITOR");

    // this._http.post(environment.BASE_API_PATH_MYCLASS + "User_RecordingMaterialMapping/GetPurchasedDataByUserEmail", { emailId: this.userDetails.email }).subscribe(res => {
    this._http.post(environment.BASE_API_PATH + "PurchasePlan/GetAllPurchaseCourseDetailsByUserId", { userId: this.userDetails.userId }).subscribe(res => {
      if (res.isSuccess) {
        // this.objCourses = res.data.filter(x=> x.itemTypeId == 2 && x.batchId !=0);
        this.objCourses = res.data.filter(x => x.batchId != 0);
      }
    })
  }
  data: any;
  goBack() {
    // this._router.navigate(['my-courses']);
    this.isOpenSysCongfig = false;

  }

  navigateToVideo(data: any) {
    if (data.isPlayVideoOnlineId == 1) {
      this.data = data;
      this._crypto.setStorage('courseData',JSON.stringify(data));
      this._http.post(environment.BASE_API_PATH_MYCLASS + "MyClass_PlayOnlinePaidVideo/PlayOnlinePaidVideo_GetByUserId", { userId: this.userDetails.userId }).subscribe(res => {
        if (res.isSuccess) {
          let resData = res.data.find(x => (x.courseId == data.itemId && x.batchId == data.batchId) && x.isReIssue == 0);
          if (resData) {
            // if (resData.sysConfigStatusId == 3 && resData.demoVideoStatusId == 3 ) {
            if (resData.sysConfigStatusId == 3 && resData.demoVideoStatusId == 3) {
              let did = this._auth.visitorId();
              if (did === resData.deviceId) {
                this._router.navigate(['videos'])
                // window.open('videos', '_blank');
              } else {
                Swal.fire({
                  title: "Access Denied!",
                  html: `
              <p>You have configured this course on <strong>${resData.sysType}</strong> system. Please login on your registered system.</p>
            `,
                  icon: "error",
                  showCancelButton: false,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Ok"
                })
              }
            } else {
              this.isOpenSysCongfig = true;
            }
          } else {
            this.isOpenSysCongfig = true;
          }
        } else {
          if (res.data == null) {
            this.isOpenSysCongfig = true;
          }
        }
      })
    } else {
      Swal.fire({
        icon: "error",
        title: "Sorry...",
        text: "You are not applicable for this course.",
      });
    }


  }




}
