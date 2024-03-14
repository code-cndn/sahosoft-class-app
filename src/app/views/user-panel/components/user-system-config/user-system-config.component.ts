import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../../shared/http.service';
import { environment } from '../../../../../environments/environment';
import { formatDate } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { LoaderComponent } from '../../../../shared/components/other/loader/loader.component';
import Swal from 'sweetalert2';
import { CommonService } from '../../../../shared/common.service';
import { MatRadioModule } from '@angular/material/radio';
import { CryptoService } from '../../../../shared/crypto.service';
import { invoke } from '@tauri-apps/api'

@Component({
  selector: 'app-user-system-config',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    VideoPlayerComponent,
    LoaderComponent,
    MatRadioModule
  ],
  templateUrl: './user-system-config.component.html',
  styleUrl: './user-system-config.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UserSystemConfigComponent implements OnInit {
  _toastr = inject(ToastrService);
  _crypto = inject(CryptoService);


  firstFormGroup = this._formBuilder.group({
    id: [''],
    SystemScreenshotPath: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    isDemoPlay: ['', Validators.required],
  });
  // thirdFormGroup = this._formBuilder.group({
  //     terms:['',Validators.required]
  // });

  isLinear = true;
  visitorId: string;
  screenshotPathSelected: any;
  userDetails: any;
  devicedID: any;
  _http = inject(HttpService);
  osData: any;
  constructor(private _formBuilder: FormBuilder, public _common: CommonService) { }
  ngOnInit(): void {

    this.userDetails = JSON.parse(this._crypto.getStorage("SYSUSER_DT"));
    this.devicedID = this._crypto.getStorage("VISITOR");
    this.getPlayOnlinePaidVideoData();
    this.getosData();
  }
  async getosData() {
    await invoke('create_point')
      .then((message) => {
        this.osData = message
      })
      .catch((error) => console.error(error))
  }
  @ViewChild('screenshot') elscreenshot: ElementRef;

  screenshotImage: string;
  formData = new FormData();
  screenShotUpload(screenshot: any) {
    if (screenshot.length === 0) {
      return;
    }
    let type = screenshot[0].type;
    if (type.match(/image\/*/) == null) {
      this._toastr.error("Please upload a valid image !!");
      this.elscreenshot.nativeElement.value = "";
    }
    this.screenshotPathSelected = screenshot[0];

    //read image
    let reader = new FileReader();
    reader.readAsDataURL(screenshot[0]);
    reader.onload = () => {
      this.screenshotImage = reader.result.toString();
    }
  }



  loader: boolean = false;
  @Input() data: any;
  SaveScreenshot() {
    let courseData = JSON.parse(this._crypto.getStorage('courseData'));

    let datestr = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.formData = new FormData();
    if (!this.screenshotPathSelected) {
      this._toastr.error("Please Upload Screenshot !!");
      return;
    }
    this.loader = true;
    // this.formData.append("Id", this.firstFormGroup.value.id);
    this.formData.append("Id", "0");
    this.formData.append("UserId", this.userDetails.userId);
    this.formData.append("Email", this.userDetails.email);
    this.formData.append("UserName", this.userDetails.name);
    this.formData.append("CourseName", this.data.itemName);
    this.formData.append("BatchId", this.data.batchId);
    this.formData.append("CourseId", this.data.itemId);
    this.formData.append("PurchasePlanId", courseData.purchasePlanId);
    // this.formData.append("IsDemoPlay", "0");
    // this.formData.append("BrowserId", "1");
    this.formData.append("SysConfigStatusId", "2");
    // this.formData.append("SysConfigStatusRemarks", "");
    // this.formData.append("DeviceId", ""); //this.devicedID
    // this.formData.append("DeviceIdDate", datestr);//datestr
    this.formData.append("SystemScreenshotDate", datestr);
    this.screenshotPathSelected ? this.formData.append("SystemScreenshotPath", this.screenshotPathSelected, this.screenshotPathSelected.name) : "";

    this._http.postImage(environment.BASE_API_PATH_MYCLASS + "MyClass_PlayOnlinePaidVideo/SaveUpdate/", this.formData).subscribe(res => {
      if (res.isSuccess) {
        this.loader = false;
        this.getPlayOnlinePaidVideoData();
        this.goToStep(1);
      } else {
        this.loader = false;
      }

    })

  }
  isShowCheckBox: boolean = false;
  toggleCheckBox() {
    this.isShowCheckBox = !this.isShowCheckBox;
  }
  demoVideoPlayed() {

    if (this.secondFormGroup.invalid) {
      this._toastr.error("Please select one of the options!", "Demo Video");
      this.loader = false;
      return;
    }

    this.loader = true;
    let obj = {
      id: this.videoData.id,
      isDemoPlay: parseInt(this.secondFormGroup.value.isDemoPlay)
    }

    if (this.secondFormGroup.value.isDemoPlay == '0') {
      this.loader = false;
      Swal.fire({
        title: "<strong>Sorry..</strong>",
        icon: "info",
        html: `
          <p class="fs-5 fw-bold">Please Contact to +91-8588805737.</p>
        `,
        showCloseButton: true,

        focusConfirm: false,

      });
      return;
    }
    this._http.postImage(environment.BASE_API_PATH_MYCLASS + "MyClass_PlayOnlinePaidVideo/UpdateIsDemoPlay/", obj).subscribe(res => {
      if (res.isSuccess) {
        this.loader = false;
        if (this.secondFormGroup.value.isDemoPlay == '1') {
          this.goToStep(2);
        } else {
          Swal.fire({
            title: "<strong>Sorry..</strong>",
            icon: "info",
            html: `
              <p class="fs-5 fw-bold">Please Contact to +91-8588805737.</p>
            `,
            showCloseButton: true,

            focusConfirm: false,

          });
        }
        this.getPlayOnlinePaidVideoData();
      } else {
        this.loader = false;
      }


    })
  }
  getSysTypeId(os: any) {

    if (os == 'Windows')
      return 1;
    else if (os == 'Linux')
      return 2;
    else if (os == 'Darwin')
      return 3;
    else return 4;


  }
  SaveData() {
    this.loader = true;
    let datestr = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    let obj = {
      id: this.videoData.id,
      email: this.userDetails.email,
      userName: this.userDetails.name,
      courseName: this.data.itemName,
      // BrowserId: this.getBrowserId(parser.getResult().browser.name),
      sysTypeId: this.getSysTypeId(this.osData.ostype),
      sysInfo: this.osData.osinfo,
      deviceId: this.devicedID,
      deviceIdDate: datestr
    }
    this._http.postImage(environment.BASE_API_PATH_MYCLASS + "MyClass_PlayOnlinePaidVideo/UpdateOnlinePaidVideoSysConfig/", obj).subscribe(res => {
      if (res.isSuccess) {
        
        this.loader = false;
        this.getPlayOnlinePaidVideoData();
        this.completedSteps[2] = true
        // this.goToStep(3);
        // this.goToStep(1);
      } else {
        this.loader = false;
      }

    })
  }
  @ViewChild('stepper') stepper: MatStepper | undefined;
  completedSteps: boolean[] = [false, false, false];
  stepCompleted(index: number): boolean {
    return this.completedSteps[index];
  }

  goToStep(index: number) {
    if (this.stepper) {
      setTimeout(() => {
        this.stepper.selectedIndex = index;
        this.updateCompletedSteps(index - 1);
      }, 1);
      // this.stepper.selectedIndex = index;

    }

  }

  updateCompletedSteps(index: number) {
    for (let i = 0; i <= index; i++) {
      this.completedSteps[i] = true;


    }
  }
  videoData: any;
  selectedIndex: any;
  getPlayOnlinePaidVideoData() {

    this._http.post(environment.BASE_API_PATH_MYCLASS + "MyClass_PlayOnlinePaidVideo/PlayOnlinePaidVideo_GetByUserId", { userId: this.userDetails.userId }).subscribe(res => {
      if (res.isSuccess) {
        if(res.data.length !=0){
          let resData = res.data.find(x => (x.courseId == this.data.itemId && x.batchId == this.data.batchId) && x.isReIssue == 0);
            if(resData){
              if ((resData.sysConfigStatusId == 2 || resData.sysConfigStatusId == 3)) {
                this.completedSteps[0] = true
                this.goToStep(1);
                this.selectetdVideo();
                // if(resData.isReIssue)
                if (resData.isDemoPlay == 1 && resData.isReIssue == 0) {
                  this.completedSteps[1] = true
                  this.goToStep(2);
      
      
                } else if (resData.isReIssue == 1) {
      
                }
      
              }
              this.videoData = resData;
            }
        }
        
        
      

      }
    });
  }
  vidParams: any
  selectetdVideo() {
    let obj = {
      userId: this.userDetails.userId,
      date: new Date(),
      videoId: 10001,
      isPlay: 0,
    }
    // Stream_videoPlayInfo
    // this._http.post(environment.BASE_VIDEO_API_PATH + 'VideoPlayerInfo/Save', obj)
    this._http.post(environment.BASE_API_PATH + 'Stream_videoPlayInfo/Save', obj)
      .subscribe(res => {
        if (res.isSuccess) {
          
          let obj2 = {
            token: res.data.token,
            videoId: obj.videoId,
            streamTypeId: 2
          }
          this.vidParams = obj2;

        }
      })

  }

}
