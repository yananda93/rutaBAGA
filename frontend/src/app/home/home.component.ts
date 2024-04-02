import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService} from '../_services/user.service'
import { ApplicationService} from '../_services/application.service'
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ExcelService} from '../_services/excel.service';
import {JoyrideService} from 'ngx-joyride';
import {TourStatusService} from '../_services/tourstatus.service'

import * as d3 from 'd3';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user;
  isAdmin=window.sessionStorage.getItem("isAdmin") == "1";
  numAssigned=0;
  numAssignedReviewed;
  numApplications;
  numReviewed;
  userStatus;
  errorMessage = "";
  empty = "";
  slash = "/";
  reviewStatus = [];


  currentId; 
  dataConfig;

  userId = window.sessionStorage.getItem("userId");
  numApplicants = 12; 

  constructor(
    private userService: UserService,
    private applicationService: ApplicationService,
    private excelService:ExcelService,
    private router: Router,
    private readonly joyrideService: JoyrideService,
    private tourStatusService: TourStatusService) { }

  @ViewChild(MatSort) sort: MatSort;


  ngOnInit(): void {
    this.getUserStatus();
    this.getApplicationCount();

  }

  ngAfterViewInit() {

  }


  getUserStatus() {
    this.userService.getUserStatus().subscribe(
      data => {
  
        this.userStatus = data;
        this.getAssignedApplications();
      },
      err => {
        this.errorMessage = err.error.message;
      });
  }
  
  getApplicationCount() {
    this.applicationService.getApplicationCount().subscribe(
      data => {
        this.numApplications = data[0];
        this.numReviewed = data[1];
     
      },
      err => {
        this.errorMessage = err.error.message;
      });

  }

  getAssignedApplications() {
    this.userService.getAssignedApplications().subscribe(
      data => {  
        if(data.length > 0) {  
          let count = 0;
          for(let i = 0; i < data.length; i++) {
            if(data[i].viewed) {
              count++;
            }
          }
          this.numAssigned = data.length;
          this.numAssignedReviewed = count;
               
      }


      if(this.userStatus.current_id == 0 || this.userStatus.current_id == null) {
        if(data.length > 0) {
          // this.currentId = data[0].applicant_id;
          let array = [];
          for (var i = 1; i <= this.numApplicants; i++) {
            array.push(i);
          }
         this.generateOrder(this.userId, array);

          for (var i = 0; i < this.numApplicants; i++) {
            if (data.findIndex(x => x.applicant_id == array[i]) > -1) {
              this.currentId = array[i];
              break;
            }
          }

        }
        else {
          this.currentId = 1;
        }
      }
      else {
        this.currentId = this.userStatus.current_id;
      }

    },
      err => {

      }
    );
  } 

  

  // startReview() {
  //   // console.log(this.currentId)
  //   this.router.navigate(['rating/', this.currentId]);
  // }

  updateTourStatus() {
    this.userService.updateTourStatus().subscribe(
      data => {
       
      },
      err => {
        
      });
  }
  


  startTour() {

    this.joyrideService.startTour(
      { 
        customTexts: {
          // next: '>>',
          // prev: '<<',
          done: 'Get Started'
        },
       steps: ['step1', 'step2@rating/tour/0', 'step3@rating/tour/0',
      'step4@rating/tour/0', 'step5@rating/tour/0','step6@rating/tour/0', 
      'step7@rating/tour/0','step8', 'step9@rating/tour/0']
    } 
    ).subscribe(
      step => { 
      },
      error => {
      },
      () => {
        // console.log('Tour finished');
        this.tourStatusService.setVariable(true);
        this.updateTourStatus();
        // this.router.navigate(['home/']);
        this.router.navigate(['rating/', this.currentId]);


      }
    )

  }
  generateOrder(id, array) {
    const random = d3.randomLcg(id);
    const shuffle = d3.shuffler(random);
    shuffle(array);
  }

  // checkReviewStatus() {
  //     this.applicationService.getReviewStatus().subscribe(
  //       data => {
  //         // console.log(data)
  //         this.reviewStatus = data;
  //         this.statusDataSource = new MatTableDataSource(data);
  //         this.statusDataSource.sort = this.sort;
       
  //       },
  //       err => {
  //         this.errorMessage = err.error.message;
  //       });
  // }

//   getAllReviews() {
//     this.applicationService.getAllReviews().subscribe(
//       data => {
//         // console.log(data)
//         this.allreviews = data;
//         this.reviewsDataSource = new MatTableDataSource(data);
//         this.reviewsDataSource.sort = this.sort;
     
//       },
//       err => {
//         this.errorMessage = err.error.message;
//       });
// }

  // onSaveReviews() {
  //   this.excelService.exportAsExcelFile(this.allreviews, 'allreviews', this.reviewsDisplayedColumns);
  // }
  // onSaveStatus() {
  //   this.excelService.exportAsExcelFile(this.reviewStatus, 'reviewstatus', this.statusDisplayedColumns);
  // }

  // onSaveInterviewStatus() {
  //   this.excelService.exportAsExcelFile(this.interviewStatus, 'interviewstatus', this.interviewstatusDisplayedColumns);
  // }

  // onSaveInterviewReviews() {
  //   this.excelService.exportAsExcelFile(this.allinterviewreviews, 'allinterviewreviews', this.interviewreviewsDisplayedColumns);
  // }

}
