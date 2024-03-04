import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { NoWhiteSpaceValidator } from '../../../shared/validations/validations.validator';
import { environment } from '../../../../environments/environment';
import { HttpService } from '../../../shared/http.service';

@Component({
  selector: 'app-ask-question-model',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatTabsModule,
    ReactiveFormsModule
  ],
  templateUrl: './ask-question-model.component.html',
  styleUrl: './ask-question-model.component.scss'
})
export class AskQuestionModelComponent {
  dataForQuery: any
  submitted = false;
  isGo = false;
  addForm: FormGroup;
  courseRelSelected = 1;
  otherRelSelected = 0;
  formErrors = {
    queryTitle: '',
    queryDetails: '',
    issue: '',
  };
  validationMessage = {
    queryTitle: {
      required: 'Title is required'
    },
    issue: {
      required: 'Issue is required'
    },
    queryDetails: {
      required: 'Detail is required',
      noWhiteSpaceValidator: 'Not Allowed whitespace only',
      minlength: 'minimum 10 characters',
      maxlength: 'maximum 500 characters'

    },
  };
  isOtherRel: boolean = false;
  constructor(public dialogRef: MatDialogRef<AskQuestionModelComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder, private _toastr: ToastrService, private _http: HttpService) { }
  onNoClick() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    
    this.setFormState();
    // console.log(this.dataForQuery);
  }

  setFormState() {
    // this.submitted = false;
    // this.isGo = false;
    // this.dbops = DbOperation.create;
    this.addForm = this._fb.group({
      id: [0],
      queryTitle: ['', Validators.compose([Validators.required])],
      queryDetails: ['', Validators.compose([Validators.required, NoWhiteSpaceValidator.noWhiteSpaceValidator, Validators.minLength(10), Validators.maxLength(500)])],
      issue: [''],
    });
    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanges();
    });
  }
  onValueChanges() {
    if (!this.addForm) {
      return;
    }
    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";
      const control = this.addForm.get(field);
      if (control && control.dirty && control.invalid) {
        const message = this.validationMessage[field];
        for (const key of Object.keys(control.errors)) {
          if (key !== 'required') {
            this.formErrors[field] = message[key];
            break;
          }
        }
      }
    }
  }
  get ctrl() {
    return this.addForm.controls;
  }
  tabIndex = 0;
  tabChanged(event: MatTabChangeEvent): void {
    this.tabIndex = event.index;
    this.addForm.reset();
  }


  selectOtherRel() {
    this.isOtherRel = true;
    this.courseRelSelected = 0;
    this.otherRelSelected = 1;
    this.addForm.get('issue').setValidators(Validators.required);
  }
  Submit() {
    this.submitted = true;
    this.isGo = true;
    if (!this.addForm.valid) {
      return;
    }
    let obj = {
      courseId: this.data.itemId,
      userId: this.data.userId,
      typeId: this.data.typeId,
      topicId: this.data.topicId,
      queryTitle: this.addForm.controls['queryTitle'].value,
      queryDetails: this.addForm.controls['queryDetails'].value,
      isCourseRelated: this.tabIndex == 0 ? 1:0,
      isOtherIssue: this.tabIndex == 1 ? 1:0,
      issue: this.addForm.controls['issue'].value ? this.addForm.controls['issue'].value : '',
      likes: 0
    }
    this._http.post(environment.BASE_API_PATH + "PaidVideoCourseQuery/Save/", obj).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success("Query Sent !!", "Tutorial Query");
        this.onNoClick();
      } else {
        this._toastr.error(res.errors, "Tutorial Query");
      }
    });
  }


}
