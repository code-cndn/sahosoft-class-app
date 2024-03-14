import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import { HttpService } from '../../shared/http.service';
import { environment } from '../../../environments/environment';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VideoPlayerComponent } from '../user-panel/components/video-player/video-player.component';
import { LoaderComponent } from '../../shared/components/other/loader/loader.component';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { NgxStarsModule } from 'ngx-stars';
import { DatePipe, NgClass, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import { ShortNamePipe } from '../../shared/pipes/short-name.pipe';
import { DateAsAgoPipe } from '../../shared/pipes/date-as-ago.pipe';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AskQuestionModelComponent } from './ask-question-model/ask-question-model.component';
import { CryptoService } from '../../shared/crypto.service';
import { TextTruncatePipe } from '../../shared/pipes/text-truncate.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-play-videos-videoplayer',
  standalone: true,
  imports: [VideoPlayerComponent, LoaderComponent, RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule, MatTabsModule,
    FormsModule, NgxStarsModule, NgClass, ShortNamePipe, DateAsAgoPipe, TitleCasePipe, UpperCasePipe,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    DatePipe, TextTruncatePipe, MatTooltipModule],
  templateUrl: './play-videos-videoplayer.component.html',
  styleUrl: './play-videos-videoplayer.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PlayVideosVideoplayerComponent implements OnInit {
  _crypto = inject(CryptoService);
  navigationExtras: any;
  chapterId: number;
  videoIndex: number = 0;
  chapterVideoLen: number = 0;
  selectedVideoId: any;
  objVideoList: any = [];
  courseName: any;
  totalVideos: any;
  totalLactures: any;
  objReviewData: any;
  default: any;
  objSelectedQuerie: any;
  reviewForm: FormGroup;

  obj = {
    searchColumn: "",
    searchValue: "",
    pageNo: 1,
    pageSize: 100000,
    sortColumn: "classDate",
    sortOrder: "DESC"
  }
  userDetails: any;
  data: any;
  objTopics: any[] = [];
  constructor(private meta: Meta, private _fb: FormBuilder, private _http: HttpService,
    private _router: Router, private _toaster: ToastrService, public dialog: MatDialog

  ) {
  }
  courseData: any;
  commentForm: FormGroup;
  ngOnInit(): void {
    this.commentForm = this._fb.group({
      id: [0],
      comments: ['', Validators.compose([Validators.required, Validators.minLength(4)])],

    })

    this.meta.addTags([
      { name: 'description', content: 'This is an article about Angular Meta service' },
      { name: 'keywords', content: 'angular, javascript, typescript, meta, seo' }
    ]);
    this.courseData = JSON.parse(this._crypto.getStorage('courseData'));
    this.userDetails = JSON.parse(this._crypto.getStorage("SYSUSER_DT"));
    this.setReviewState();
    this.getData();
    this.getReview();
    this.getAllDoubtQuestion();

  }

  goBack() {
    this._router.navigate(['user/my-courses']);
  }
  getData() {
    let userDetails = JSON.parse(this._crypto.getStorage("SYSUSER_DT"));
    this._http.post(environment.BASE_API_PATH_MYCLASS + "MyClass_PlayOnlinePaidVideo/PlayOnlinePaidVideo_GetByUserId", { userId: userDetails.userId }).subscribe(res => {
      if (res.isSuccess) {
        this.data = res.data;
        let obj = {
          courseId: this.courseData.itemId,
          batchId: this.courseData.batchId
        }

        this._http.post(environment.BASE_API_PATH + "Course_PaidVideocourses_CourseChapterTopic/GetTopicByCourseAndBatch", obj).subscribe(res => {
          if (res.isSuccess) {
            this.objVideoList = res.data;

            this.totalLactures = this.objVideoList.length;
            // classTimeTableId

            this._http.get(environment.BASE_API_PATH + "Course_PaidVideocourses_CourseChapterTopic/GetUrlName_ByClassTimeTableId/" + this.objVideoList[0].classTimeTableId).subscribe(res => {
              if (res.isSuccess) {
                let data = res.data;

                this.totalVideos = this.objVideoList.length;
                this.default = this.objVideoList.find(x => x.courseId == this.courseData.itemId && x.srNo == 1);
                this.courseName = this.default.courseName;
                this.chapName = this.default.topicName;
                this.topicadetails = data[0].urlName;
                this.chapterVideoLen = data.length;
                this.playVid(this.chapName, this.topicadetails, this.default.id, 0, data[0].id);
              }
            });
          }

        })

      } else {
        this._router.navigate(["/"]);
      }
    })
  }

  selectedTabIndex: any;
  onTabChange(event: MatTabChangeEvent): void {

    // Access the selected index
    this.selectedTabIndex = event.index;

  }
  downloadNotes() {
    let d = this.objVideoList.find(x => x.id == this.chapterId);
    let notesPath = d.resoursePath.toLowerCase();

    if (notesPath != 'n/a')
      window.open(d.resoursePath, "_blank");
    else
      alert('Notes not available for the chapter.');


  }
  vidParams: any
  isLoading: boolean = true;
  videoElement: HTMLVideoElement;
  loader: HTMLVideoElement;
  selectetdVideo(id: any, chapetId: any) {

    // const video_players = document.querySelectorAll(".video_player");
    // this.videoElement = document.querySelector("customVideoPlayer");
    // this.loader = document.querySelector(".loader");

    // if (this.vidParams) {
    //   this.videoElement.src = ''
    //   this.videoElement.play();
    // }

    this.vidParams = null
    this.isLoading = true;
    let obj = {
      userId: this.userDetails.userId,
      date: new Date(),
      videoId: id,
      isPlay: 0,
    }

    // this._http.post(environment.BASE_VIDEO_API_PATH + 'VideoPlayerInfo/Save', obj)
    this._http.post(environment.BASE_API_PATH + 'Stream_videoPlayInfo/Save', obj)
      .subscribe(res => {

        if (res.isSuccess) {
          let obj2 = {
            token: res.data.token,
            videoId: obj.videoId,
            streamTypeId: this.courseData.streamTypeId
          }

          this.vidParams = obj2;
          this.navigationExtras = {
            queryParams: {
              myObject: JSON.stringify(obj2)
            }
          };

          // this._router.navigate(['videos', id, 'video-panel'], this.navigationExtras)

          // this._router.navigate(['videos/1','video-panel'], navigationExtras);
          // this._router.navigate(['video-panel'], {
          //   queryParams: { vidParams: JSON.stringify(this.vidParams) }
          // });

          this.isLoading = false;
          // $.getScript('assets/js/script.js');

        }
      })

  }
  objAllDoubtQuestion: any[] = [];
  filterAllDoubtQuestion: any[] = [];
  getAllDoubtQuestion() {

    let obj = {
      "searchColumn": "",
      "searchValue": "",
      "pageNo": 1,
      "pageSize": 1000000,
      "sortColumn": "createdOn",
      "sortOrder": "desc",
      "courseId": this.courseData.itemId,
      "userId": this.userDetails.userId
    }

    this._http.post(environment.BASE_API_PATH + "PaidVideoCourseQuery/GetAllByCourseId", obj).subscribe(res => {
      if (res.isSuccess) {
        this.objAllDoubtQuestion = res.data;
        this.filterAllDoubtQuestion = this.objAllDoubtQuestion

        // let udata = this.filterAllDoubtQuestion.find(x=> x.userId == this.userDetails.userId);
        // console.log(udata);

      }
    })
  }

  getFilterData(val: any) {
    switch (val) {
      case 1:
        this.getAllDoubtQuestion();
        break;
      case 2:
        this.objAllDoubtQuestion.filter(x => x.userId == this.userDetails.userId);
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;

    }

  }
  filterByTopic(event: any) {
    const selectedValue = parseInt(event.value);

    this.filterAllDoubtQuestion = this.objAllDoubtQuestion.filter(x => x.topicId == selectedValue)
  }
  getSortedAllDoubtQuestion(obj: any) {
    this._http.post(environment.BASE_API_PATH + "PaidVideoCourseQuery/GetAllByCourseId", obj).subscribe(res => {
      if (res.isSuccess) {
        this.filterAllDoubtQuestion = res.data;



      }
    })
  }
  sortDoubtQuestion(event: any) {

    const selectedValue = parseInt(event.value);
    switch (selectedValue) {

      case 1:
        let obj = {
          "searchColumn": "",
          "searchValue": "",
          "pageNo": 1,
          "pageSize": 1000000,
          "sortColumn": "createdOn",
          "sortOrder": "desc",
          "courseId": this.courseData.itemId,
          "userId": this.userDetails.userId
        }
        this.getSortedAllDoubtQuestion(obj);
        break;
      case 2:
        let obj2 = {
          "searchColumn": "",
          "searchValue": "",
          "pageNo": 1,
          "pageSize": 1000000,
          "sortColumn": "createdOn",
          "sortOrder": "asc",
          "courseId": this.courseData.itemId,
          "userId": this.userDetails.userId
        }
        this.getSortedAllDoubtQuestion(obj2);
        break;
      case 3:
        let obj3 = {
          "searchColumn": "",
          "searchValue": "",
          "pageNo": 1,
          "pageSize": 1000000,
          "sortColumn": "likes",
          "sortOrder": "asc",
          "courseId": this.courseData.itemId,
          "userId": this.userDetails.userId
        }
        this.getSortedAllDoubtQuestion(obj3);
        break;
    }


  }
  search(search: any) {
    let obj = {
      "searchColumn": "queryTitle",
      "searchValue": search,
      "pageNo": 1,
      "pageSize": 1000000,
      "sortColumn": "",
      "sortOrder": "",
      "courseId": this.courseData.itemId,
      "userId": this.userDetails.userId
    }
    this.getSortedAllDoubtQuestion(obj);

  }
  askQuestion() {

    let objForQuery = {
      userId: this.courseData.userId,
      itemId: this.courseData.itemId,
      typeId: this.courseData.typeId,
      topicId: this.chapterId
    }
    const dialogRef = this.dialog.open(AskQuestionModelComponent, {
      width: '600px',
      data: objForQuery
    },
    );


    dialogRef.afterClosed().subscribe(result => {

      this.getAllDoubtQuestion();
    });
    // if (this.islog) {
    //   this.modalRefForQuery = this.modalService.open(AskQueryComponent,
    //     {
    //       modalClass: 'modal-lg',
    //       data: { dataForQuery: objForQuery }
    //     });
    // }
    // else {
    //   this.storage.setStorage('void', '0');
    //   this.modalService.open(LoginPopupComponent,
    //     {
    //       modalClass: 'modal-md',
    //       data: {
    //         typeId: 2
    //       }
    //     });
    // }
  }
  getReview() {
    let obj = {

      userId: this.courseData.userId,
      itemId: this.courseData.itemId,
      typeId: this.courseData.itemTypeId,
    }
    this._http.post(environment.BASE_API_PATH + "Course_PaidVideoCourseReveiw/GetAllPaidVideoCourseReviewByItemId", obj).subscribe(res => {
      if (res.isSuccess) {
        this.objReviewData = res.data;
      }
    })


  }
  setReviewState() {
    this.reviewForm = this._fb.group({
      id: [0],
      title: ['', Validators.compose([Validators.required,])],
      review: ['', Validators.compose([Validators.required,])],
      rating: ['']
    })
  }

  ratingDisplay: number;

  onRatingSet(rating: number): void {
    this.ratingDisplay = rating;

  }
  SubmitReview() {
    if (this.reviewForm.invalid) {
      this._toaster.error("Please fill details correctly!", 'Rerview');
      return;
    }

    let obj = {
      id: 0,
      itemId: this.courseData.itemId,
      typeId: this.courseData.itemTypeId,
      studentId: this.courseData.userId,
      title: this.reviewForm.value.title,
      review: this.reviewForm.value.review,
      rating: this.ratingDisplay
    }

    this._http.post(environment.BASE_API_PATH + 'Course_PaidVideoCourseReveiw/Save', obj).subscribe(res => {
      if (res.isSuccess) {
        this.reviewForm.reset();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Thanks for your review',
          text: 'Have a graete day.',
          showConfirmButton: false,
          timer: 2500
        });
        this.getReview();
        // this.general.getPaidCouresReview(objrev);


      } else {
        this._toaster.error('Somthing went wrong!', 'Course Review');
      }
    })
  }
  getTopics(classTimeTableId: any) {
    this._http.get(environment.BASE_API_PATH + "Course_PaidVideocourses_CourseChapterTopic/GetUrlName_ByClassTimeTableId/" + classTimeTableId).subscribe(res => {
      if (res.isSuccess) {
        this.objTopics = res.data;
      }
    });
    // this.topics = this.objTopics.filter(x => {
    //   if (x.chapterId == topicId) {
    //     return x;
    //   }
    // })
    // this.chapterVideoLen = this.topics.length;
  }
  chapName: string;
  topicadetails: string;
  @ViewChild('temp') temp: ElementRef;
  playVid(chap: any, topicdetails: any, chapterId: number, index: number, videoId: any) {

    this.chapName = chap;
    this.topicadetails = topicdetails;
    this.chapterId = chapterId;
    this.videoIndex = index;

    this.selectedVideoId = videoId;
    if (this.objTopics.length > 0)
      this.chapterVideoLen = this.objTopics.length;
    // // console.log(this.selectedVideoId);
    // this.getQueries();
    // this.filterText = 'All Lectures';
    // this.temp.nativeElement.value = 'All';
    this.selectetdVideo(videoId, chapterId);

  }
  isexpandPanel: boolean = false;
  // expandPanel() {
  //   this.isexpandPanel = !this.isexpandPanel;
  // }
  SubmitComments(id: any) {

    if (this.commentForm.invalid)
      return;

    let obj = {
      id: 0,
      userId: this.userDetails.userId,
      tutorialQueryId: id,
      comment: this.commentForm.value.comments

    }
    this._http.post(environment.BASE_API_PATH + "PaidVideoCourseQueryComments/Save", obj).subscribe(res => {
      if (res.isSuccess) {
        this.isexpandPanel = false;
        this.commentForm.reset();
        let obj = {
          "searchColumn": "",
          "searchValue": "",
          "pageNo": 1,
          "pageSize": 1000000,
          "sortColumn": "createdOn",
          "sortOrder": "desc",
          "courseId": this.courseData.itemId,
          "userId": this.userDetails.userId
        }
        this.getSortedAllDoubtQuestion(obj);
      }
    })

  }
  GetQueryCommentByQueryId(id: any) {
    // if(this.isLikeComment)
    //  this.isexpandPanel = !this.isexpandPanel;
    let obj = {
      userId: this.userDetails.userId,
      tutorialQueryId: id
    }
    this._http.post(environment.BASE_API_PATH + "PaidVideoCourseQueryComments/GetQueryCommentByQueryId", obj).subscribe(res => {
      if (res.isSuccess) {
        this.objSelectedQuerie = res.data;

      }
    })
  }

  likeQuery(id: any) {

    let obj = {
      LikeTypeId: 1,
      tutorialQueryId: id,
      tutorialQueryCommentId: 0,
      isLike: 1,
      likeById: this.userDetails.userId

    }
    this._http.post(environment.BASE_API_PATH + "PaidVideoCourseQuery/AddQueryLikes", obj).subscribe(res => {
      if (res.isSuccess) {
        let obj = {
          "searchColumn": "",
          "searchValue": "",
          "pageNo": 1,
          "pageSize": 1000000,
          "sortColumn": "createdOn",
          "sortOrder": "desc",
          "courseId": this.courseData.itemId,
          "userId": this.userDetails.userId
        }
        this.getSortedAllDoubtQuestion(obj);
      }
    })
  }
  isLikeComment: boolean = true;
  likeComment(id: any, queryId: any) {
    // ;
    let obj = {
      likeTypeId: 2,
      tutorialQueryCommentId: id,
      isLike: 1,
      likeById: this.userDetails.userId
    }
    this._http.post(environment.BASE_API_PATH + "PaidVideoCourseQueryComments/AddCommentLikes", obj).subscribe(res => {
      if (res.isSuccess) {
        // this.reply(this.selectedQueryId);
        this.isLikeComment = false;
        this.GetQueryCommentByQueryId(queryId);

      }
    })
  }


  ngOnDestroy(): void {
  }

}
