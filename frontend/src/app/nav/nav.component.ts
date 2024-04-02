import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { UserService} from '../_services/user.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../custom-validators';
import { Interaction, VISInteraction } from '../_models/interaction';
import { InteractionTypes, InteractionElements } from '../constants';

import {ReviewStatusService} from '../_services/reviewstatus.service';
import {TourStatusService} from '../_services/tourstatus.service'
import {FinishedService} from '../_services/finished.service'
import { Subscription } from 'rxjs';

import * as d3 from 'd3';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  currentId = 1;
  url;
  activeClass;
  pwChangeForm: FormGroup;
  message;
  errorMessage;
  reset = false;
  userStatus;

  numAssigned=0;

  firstAssignedID;
  firstInterviewID;

  activeRatingTab;

  isExperimentalGroup= window.sessionStorage.getItem("isAdmin") == "1";

  finishedReview = false;
  tourStatusSubscription: Subscription;
  reviewedStatusSubscription: Subscription;
  summaryTourrStatusSubscription: Subscription;

  summarySubscription: Subscription;


  toured = false;
  summaryToured = false;
  summaryVisited = false;

  userId = window.sessionStorage.getItem("userId");
  numApplicants = 12; // TODO: update to 12 

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router:Router,
    private formBuilder: FormBuilder,
    private reviewStatusService: ReviewStatusService,
    private tourStatusService: TourStatusService,
    private finishedService: FinishedService
  ) { }

  ngOnInit(): void {
    this.url = this.router.url; 
    this.getActiveClass();
    this.getUserStatus();
    // this.getFirstAssignedID();
    this.reviewedStatusSubscription = this.reviewStatusService.finished.subscribe(value => this.finishedReview = value);
    this.tourStatusSubscription = this.tourStatusService.finished.subscribe(value => this.toured = value);
    this.summaryTourrStatusSubscription = this.tourStatusService.summaryToured.subscribe(value => this.summaryToured = value);
    this.summarySubscription = this.finishedService.summaryFinished.subscribe(value => this.summaryVisited = value);
  }

  ngOnDestroy(): void {
    this.reviewedStatusSubscription.unsubscribe();
    this.tourStatusSubscription.unsubscribe();
  }



  onLogOut(event) {
    if(this.isRatingView()) {  // only sent interaction log when the user is in the Rating View
      event.stopPropagation();
      // console.log("click on logout");
      let interaction = this.initializeNewInteraction();
      interaction.element=InteractionElements.NAVBAR;
      interaction.interactionType=InteractionTypes.LOGOUT;
      this.addInteraction(interaction);
    }
    this.logOut();
  }

  logOut() {
    this.authService.logout();
  }


  getActiveClass() {
    if(this.isRatingView())
      this.activeClass = "active";
    else
    this.activeClass = "";
  }

  isRatingView() {
    return this.url.includes("rating");
  }

  
  isSummaryView() {
    return this.url.includes("individualsummary");
  }
    


  onClickLink(link, event){
    event.stopPropagation();
        
    if(this.isRatingView()) {
      let interaction = this.initializeNewInteraction();
      interaction.element=InteractionElements.INDIVIDUAL_VIEW;
      interaction.interactionType=InteractionTypes.LEAVE;
      this.addInteraction(interaction);
    }
    if(this.isSummaryView()) {
      let interaction = this.initializeNewVISInteraction();
      interaction.element=InteractionElements.SUMMARY_VIEW;
      interaction.interactionType=InteractionTypes.LEAVE;
      this.addVISInteraction(interaction);
    }

    if(link=="individualsummary") {
      let interaction = this.initializeNewVISInteraction();
      interaction.element=InteractionElements.SUMMARY_VIEW;
      interaction.interactionType=InteractionTypes.ENTER;
      this.addVISInteraction(interaction);
    }


  }


  onNextStepPhase1() {
    // console.log("next step phase 1", this.summaryVisited);
    // TODO: add interaction log
    this.finishedService.setVariable(true);
    // this.finishedService.setSummaryVariable(true); //todo: maybe move this to the summary component
    this.updateFinished();
    // this.summaryVisited = true;
    this.router.navigate(['individualsummary/']);
    
  }

  onNextStepPhase2() {
    // console.log("next step phase 2", this.summaryVisited);
    this.updateFinished2();
    this.finishedService.setSummaryVariable(true);
    this.router.navigate(['next/']);
  }
  updateFinished() {
    this.userService.updateFinished().subscribe(
      data => {
       
      },
      err => {
        
      });
  }
  updateFinished2() {
    this.userService.updateUserVisitStatus().subscribe(
      data => {
       
      },
      err => {
        
      });
  }



  onClickNavbar() {
    if(this.isRatingView()) {  // only sent interaction log when the user is in the Rating View
      let interaction = this.initializeNewInteraction();
      interaction.element=InteractionElements.NAVBAR;
      interaction.interactionType=InteractionTypes.CLICK;
      this.addInteraction(interaction);
    }

  }

  addInteraction(interaction) {
    // console.log(interaction);
    this.userService.addInteraction(interaction).subscribe(
      data => {
       
      },
      err => {
        
      });

  }
  addVISInteraction(interaction) {
    // console.log(interaction);
    this.userService.addVISInteraction(interaction).subscribe(
      data => {
       
      },
      err => {
        
      });

  }

  getUserStatus() {
    this.userService.getUserStatus().subscribe(
      data => {
  // console.log(data);
        this.userStatus = data;
        this.toured = this.userStatus.toured == 1;
        this.summaryVisited = this.userStatus.summary_finished == 1;
        this.summaryToured = this.userStatus.summarytoured == 1;

        this.finishedService.setVariable(this.userStatus.finished);
        this.finishedService.setSummaryVariable(this.userStatus.summary_finished);
        this.tourStatusService.setSummaryVariable(this.userStatus.summarytoured);

        

        this.getAssignedApplications();
        
      },
      err => {
        this.errorMessage = err.error.message;
      });
  }
 
  getAssignedApplications() {
    this.userService.getAssignedApplications().subscribe(
      data => {  

      if(this.userStatus.current_id == 0) {
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
      let num_reviewed = 0;
      for (let i = 0; i < data.length; i++) {
        if(data[i].viewed == 1) {
          num_reviewed++;
        }
      }
      this.finishedReview = (data.length == num_reviewed)

    },
      err => {

      }
    );
  } 

  initializeNewInteraction() {
  
    let interaction = new Interaction();
    interaction.applicantId = this.currentId;
    interaction.pdfType = "";
    interaction.interactionType = "";
    interaction.element="";
    interaction.applicationGroup="";
    interaction.timeStamp = new Date().getTime();
    return interaction;
  }

  initializeNewVISInteraction() {
  
    let interaction = new VISInteraction();
    interaction.applicantId = this.currentId;
    interaction.interactionType ="";
    interaction.element="";
    interaction.recommendation=null;
    interaction.xVar="";
    interaction.yVar="";
    interaction.timeEncoding=0;
    interaction.colorEncoding="";
    interaction.focusTime=0;
    interaction.plotType="";
    interaction.timeStamp = new Date().getTime(); // timestamp in ms
    return interaction;
  }

  updateUserRatingSetting(activeTab) {
    this.userService.updateUserRatingTabSetting(activeTab).subscribe(
      data => {
       
      },
      err => {
        
      });
  }


  generateOrder(id, array) {
    const random = d3.randomLcg(id);
    const shuffle = d3.shuffler(random);
    shuffle(array);
  }



}
