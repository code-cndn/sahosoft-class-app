import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { HttpService } from '../../../shared/http.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgClass, NgStyle } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import $ from 'jquery';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MustMatchValidator } from '../../../shared/validations/validations.validator';
import { LoaderService } from '../../../shared/components/other/loader/loader.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgStyle, MatButtonModule, MatDialogModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private _http: HttpService,
    private _authService: AuthService, private _toastr: ToastrService,
    public dialogRef: MatDialogRef<LoginComponent>, 
  ) { }

  isClose: boolean = false;
  loginForm: FormGroup;
  formErrors = {
    userName: '',
    password: '',

  };


  validationMessage = {
    userName: {
      required: 'EmailId is required',
      minlength: 'Minimum 1 character required',
      maxkength: 'Maximum 25 character required'
    },
    password: {
      required: 'Password is required',
      minlength: 'Minimum 1 character required',
      maxkength: 'Maximum 15 character required'
    }
  };

  ngOnInit(): void {
    this.script()
    this.setForm();



  }
  switchRecoveryOption: boolean = true;
  script() {
    $('.digit-group').find('input').each(function () {
      $(this).attr('maxlength', 1);
      $(this).on('keyup', function (e) {
        var parent = $($(this).parent());

        if (e.keyCode === 8 || e.keyCode === 37) {
          var prev = parent.find('input#' + $(this).data('previous'));

          if (prev.length) {
            $(prev).select();
          }
        } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
          var next = parent.find('input#' + $(this).data('next'));

          if (next.length) {
            $(next).select();
          } else {
            if (parent.data('autosubmit')) {
              parent.submit();
            }
          }
        }
      });
    });
  }
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  changePass: FormGroup;
  hide = true;
  @ViewChild('stepper') stepper: MatStepper | undefined;
  setForm() {
    this.loginForm = this._fb.group({
      userName: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])]
    });
    this.firstFormGroup = this._fb.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._fb.group({
      secondCtrl: ['', Validators.required],
    });
    this.changePass = this._fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validator: MustMatchValidator('password', 'confirmPassword')
    }
    );
    this.loginForm.valueChanges.subscribe(() => {
      this.onValueChanges();
    });
  }
  getErrorMessage() {
    if (this.changePass.hasError('required')) {
      return 'You must enter a value';
    }

    return this.changePass.hasError('email') ? 'Not a valid email' : '';
  }
  onValueChanges() {
    if (!this.loginForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";

      const control = this.loginForm.get(field);

      if (control && control.dirty && control.invalid) {
        const message = this.validationMessage[field];

        for (const key of Object.keys(control.errors)) {
          if (key !== 'required') {
            this.formErrors[field] += message[key] + " ";
          }
        }
      }
    }
  }
  get f() {
    return this.changePass.controls;
  }

  get ctrl() {
    return this.loginForm.controls;
  }

  login() {
    LoaderService.showLoader();
    if (this.loginForm.get('userName').value === "") {
      this._toastr.error("UserName is required !!", "Login");
    } else if (this.loginForm.get('password').value === "") {
      this._toastr.error("Password is required !!", "Login");
    } else {
      if (this.loginForm.valid) {

        // Call API
        // let obj ={
        //   userName:this.loginForm.value.userName,
        //   password:this.loginForm.value.password
        // }
        this._http.post(environment.BASE_API_PATH + "Registration_Users/Login/", this.loginForm.value).subscribe(res => {
          if (res.isSuccess) {
            
            this._authService.authLogin(res.data);
            // this.isClose = true;
            // this.dialogRef.close();

          } else {
            LoaderService.hideLoader();
            this._toastr.error(res.errors, "Login")
          }
        });
      }
    }
  }
  // tabchange(){
  //   alert()
  // }
  hideDiv:boolean=false;
  otpType: any;
  sendData: any;
  getotp(val: any, type: any) {
    this.hideDiv = true;
    this.otpType = type;
    this.sendData = val;
    if (val == '') {
      if (type == 2)
        this._toastr.error("Please enter Email Id!", "Forget Password");
      else
        this._toastr.error("Please enter your mobile number!", "Forget Password");
      return;
    }

    if (type == 1) {
      let obj = {
        mobileNo: parseInt(val)
      }
      this._http.post(environment.BASE_API_PATH + "Registration_Users/SendOptOnMobile_ForgotPassword/", obj).subscribe(res => {
        if (res.isSuccess) {
          this.stepper.next();
          this.hideDiv = false;
          // this.storage.setStorage('EN_RES', `+91 ${mobile}`);
          this._toastr.success("4 digit OTP has been sent on your mobile no !!", "Register");
          // this._genService.isOtpVerified$.next(true);
          // this.storage.removeStorage('FORM_TYPE');
          // this.storage.setStorage("FORM_TYPE", 'FPAS');
          // this.funType(5);
        } else {
          this._toastr.error(res.errors, "Register");
          this.hideDiv = false;
          // this.hideDiv = false;
          // this._genService.isOtpVerified$.next(false);
          // this.typeId = 4;
          // this.funType(4);
        }
      });

    } else if (type == 2) {
      let obj = {
        email: val
      }
      this._http.post(environment.BASE_API_PATH + "Registration_Users/ForgotPassord_SendOptOnEmail/", obj).subscribe(res => {
        if (res == 1) {
          this.stepper.next();
          this.hideDiv = false;
          // this.hideDiv = true;
          // this.storage.setStorage('EN_RES',email);
          this._toastr.success("4 Digit OTP has been sent on your Email Id !", "Forget Password");
          // this.funType(5);
        } else {
          this._toastr.error(res.errors, "Forget Password");
          this.hideDiv = false;
        }
      });
    }



  }
  OTP: any;
  validateOtp(otp: any) {
 
    this.OTP = otp;
    let apiMethod = "";
    if (this.otpType == 1) {
      //Mobile
      apiMethod = "Registration_Users/MatchForgetMobileOTP";
      let obj = {
        mobileNo: this.sendData.toString(),
        otp: otp.toString()
      }

      this._http.post(environment.BASE_API_PATH + "Registration_Users/MatchForgetMobileOTP", obj).subscribe(res => {
        if (res.isSuccess) {
          if (res.data.value == 3) {
            this._toastr.error('OTP is invalid', 'Forget Password');
          } else if (res.data.value == 4) {
            this._toastr.success("OTP matched !!", "OTP Verification");
            // this.stepper.selectedIndex = 2;
            this.stepper.next();

          } else if (res.data.value == 5) {
            this._toastr.error('OTP Expired', 'Forget Password');
          }
        }
      });
    } else if (this.otpType == 2) {
      //Email
      let obj = {
        email: this.sendData,
        otp: otp
      }
      this._http.post(environment.BASE_API_PATH + "Registration_Users/MatchForgetOTP", obj).subscribe(res => {
        if (res.isSuccess) {
          if (res.data.value == 3) {
            this._toastr.error('OTP is invalid', 'Forget Password');
          } else if (res.data.value == 4) {
            this._toastr.success("OTP matched !!", "Forget Password");
            this.stepper.next();
          } else if (res.data.value == 5) {
            this._toastr.error('OTP Expired', 'Forget Password');
          }
        }
      });

    }


  }
  submitted:boolean=false;
  changePassword() {
    this.submitted =  true;
    let obj: any;
    let apiMethod: string = '';
    if (this.sendData.includes('@')) {
      obj = {
        email: this.sendData,
        password: this.changePass.value.password,
        otp: this.OTP
      }
      apiMethod = 'ForgotPasswordChange';
    } else {
      obj = {
        mobile: this.sendData,
        password: this.changePass.value.password,
        otp: this.OTP
      }
      apiMethod = 'ForgotPasswordChangeByMobileOtp';
    }

    this._http.post(environment.BASE_API_PATH + "Registration_Users/" + apiMethod, obj).subscribe(res => {
      if (res.isSuccess) {
        if (res.data.value == 1) {
          this._toastr.success("Password Changed", "Change Password");
          // this.dialogRef.close();
          window.location.reload();

        }
      } else {
        this._toastr.error(res.errors, "Change Password");
      }
    });

  }


}
