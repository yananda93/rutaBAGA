import * as d3 from 'd3';
import { Component, OnInit, AfterViewInit, HostListener, ElementRef  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService} from '../_services/user.service'
import { ApplicationService} from '../_services/application.service'
import { UtilsService } from '../_services/utils.service';
import { DataConfig } from '../config'
import { Interaction } from '../_models/interaction';
import { InteractionTypes, InteractionElements } from '../constants'
import { Comment } from '../_models/comment';

import {ReviewStatusService} from '../_services/reviewstatus.service'


@Component({
  selector: 'app-individual-view',
  templateUrl: './individual-view.component.html',
  styleUrls: ['./individual-view.component.scss']
})
export class IndividualViewComponent implements OnInit, AfterViewInit {
    // ID and name of the applicants
  applicants = [];
  applicantsDict = {};  // key:applicant_id, value:[applicant_id, XACT_ID, first name, last name]
  // Assigned applicant IDs
  assignedApplicants= {};  //key:applicant_id, value: [applicant_id, viewed]
  assignedApplicantsList = [];
  reviewedApplicants={}; // key: applicant_id, value: applicant info + ratings 


  reviewedIndicator = "\u2713"; 
  notReviewedIndicator = "";

  reviewed = false;

  numAssigned;
  numAssignedReviewed;
  numApplications;
  numReviewed;

  currentId;     // id of the current applicant
  userId;
  userName;
  userSetting = {};
  comments: Array<Comment> = []; 
  minId;
  maxId;
  NAChecked=[];

  ratings= {
    applicant_id: null,
    academic: null,
    activities: null,
    communication: null,
    LOR_strength: null,
    recommendation: null
  };

  dataConfig;
  ratingFactors;
  ratingVariablesMap;
  ratingVariablesTooltip;

  recommendation = "Overall Rating";

  selectedAttributeList = [];
  attributeList = [];
  selectedObject = {}; // current application


  pdfLinks = ['Personal Statement', 'Resume', 'Recommendation Letter 1', 'Recommendation Letter 2', 'Transcripts'];

  pdfMapping = {
    'Personal Statement': 'PS',
    'Resume': 'Resume',
    'Recommendation Letter 1': 'LOR1',
    'Recommendation Letter 2': 'LOR2',
    'Transcripts': 'Transcripts'
  }

  activeLink = this.pdfLinks[0];

  pdfUrl;

  scrollTimer;
  mouseenterPDFTimer;
  mouseenterProfileTimer;
  mouseenterCommentTimer;
  mouseenterRatingTimer;
  delay = 2000;

  tour = false;


  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    let type="";
      if (document.hidden){
        // console.log("Page is hidden");
        type = InteractionTypes.HIDDEN;
            
      } else {
            // console.log("Page is visible");
        type = InteractionTypes.VISIBLE;
      }

      let interaction = this.initializeNewInteraction();
      interaction.element=InteractionElements.WINDOW;
      interaction.interactionType=type;
      this.addInteraction(interaction);
  }

  @HostListener('window:beforeunload', ['$event'])
   onWindowClose(event: any): void {
    let interaction = this.initializeNewInteraction();
    interaction.element=InteractionElements.WINDOW;
    interaction.interactionType=InteractionTypes.CLOSE;
    this.addInteraction(interaction);

  }

  constructor(
    private reviewStatusService: ReviewStatusService,
    private userService: UserService,
    private applicationService: ApplicationService,
    private utilsService: UtilsService,
    private route:ActivatedRoute,
    private router: Router,
    private elementRef: ElementRef
    ) {  
        this.router.routeReuseStrategy.shouldReuseRoute = function() {
          return false;
        }; 
    }

  ngOnInit() {

    this.tour = this.route.routeConfig.path.includes('tour');
 

    this.currentId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.tour) {
      this.updateCurrentId();
    }

    this.ratings.applicant_id = this.currentId;
    this.dataConfig = DataConfig;
    for(var i = 0; i < this.dataConfig.profileAttributeListAll.length; i++) {
      this.attributeList.push({"id":i + 1,"itemName":this.dataConfig.profileAttributeListAll[i]})
    }
    this.ratingFactors = this.dataConfig.ratingVariables;
    this.ratingVariablesMap = this.dataConfig.ratingVariablesMap;
    this.ratingVariablesTooltip = this.dataConfig.ratingVariablesTooltip;
    
    this.getUserSetting();
    // this.getApplications();
    this.getUserInfo();
    // this.getAssignedApplications();
    // this.getUserStatus();
    this.getSelectedApplication();
    this.getReviewedApplicants();
    // this.getApplicantFile();
    this.getComments();
    this.getRatings();

    this.getPDF(this.pdfMapping[this.activeLink]);


    // add entering Individual View interaction
    let interaction = this.initializeNewInteraction();
    interaction.element=InteractionElements.INDIVIDUAL_VIEW;
    interaction.interactionType=InteractionTypes.ENTER;
    this.addInteraction(interaction);
  }

  ngAfterViewInit() {
   

  }


  onNext(){
    
    //get prev id
    // update current id in db, 
    // navigate to next id
    let idx = this.applicantsDict[this.currentId]['idx'];
    if(idx < this.numApplications - 1) {
      this.router.navigate(['rating/',this.applicants[idx+1]['id']]);
    }
  }

  onPrev() {
    let idx = this.applicantsDict[this.currentId]['idx'];
    if(idx > 0) {  
      this.router.navigate(['rating/',this.applicants[idx-1]['id']]);
    }
   
  }
  onSelectChange(event){
    this.router.navigate(['rating/',event]);
  }

  onRatingChange(event, factor) {
    // console.log(this.ratings)
    // console.log(this.isReviewed())
    if(!this.reviewed && this.isReviewed()) {
      this.updateReviewed();
    }
    this.updateRating(factor, event.value) 
    
  }

  onRadioChange(event) {
    console.log(this.reviewed)
    if(!this.reviewed && this.isReviewed()) {
      this.updateReviewed();
    }
    this.updateRating("recommendation",Number(event.value));
  }

  
  isReviewed() {
    return this.ratings['recommendation'] != null;

  }
  
  updateReviewed() {
    this.reviewed = true;
    this.numAssignedReviewed ++;
    this.updateUserReviewed(1);
    this.assignedApplicants[this.currentId]['viewed'] = 1;
    if(this.numAssignedReviewed == this.numAssigned) {
      this.updateReviewStatus();
    }
  }

  
  // update user setting
  onSelectAttribute(event: any) {
    let interaction = this.initializeNewInteraction();
    interaction.element=event.itemName;
    interaction.interactionType=InteractionTypes.ADD_PROFILE_ATTRIBUTES;
    // console.log(interaction)
    this.addInteraction(interaction);
    this.userSetting[event.itemName] = 1;
    this.updateUserSetting();

    // reform to selected items to reserve the display order
    this.selectedAttributeList= [];
    for(let i = 0; i < this.dataConfig.profileAttributeListAll.length; i++) {
      if(this.userSetting[this.dataConfig.profileAttributeListAll[i]] == 1) {
        this.selectedAttributeList.push({"id":i+1,"itemName": this.dataConfig.profileAttributeListAll[i]})
      }
    }
  }

  onDeSelectAttribute(event: any) {
    let interaction = this.initializeNewInteraction();
    interaction.element=event.itemName;
    interaction.interactionType=InteractionTypes.REMOVE_PROFILE_ATTRIBUTES;
    this.addInteraction(interaction);

    this.userSetting[event.itemName] = 0;
    this.updateUserSetting();
  }

  onSelectAllAttribute(event: any) {
    let interaction = this.initializeNewInteraction();
    interaction.element='ALL';
    interaction.interactionType=InteractionTypes.ADD_PROFILE_ATTRIBUTES;
    this.addInteraction(interaction);

    for (const key of Object.keys(this.userSetting)) {
      this.userSetting[key] = 1;
    }
    this.updateUserSetting();   
  }

  onDeSelectAllAttribute(event: any) {
    let interaction = this.initializeNewInteraction();
    interaction.element='ALL';
    interaction.interactionType=InteractionTypes.REMOVE_PROFILE_ATTRIBUTES;
    this.addInteraction(interaction);
    
    for (const key of Object.keys(this.userSetting)) {
      this.userSetting[key] = 0;
    }
    this.updateUserSetting();
  }
 
  receiveComment(event: any) {
    this.comments.unshift(event);
    this.addComment(event.content, event.postTime);
  
  }

  removeComment(index){
    let content = this.comments[index]['content'];
    this.comments.splice(index, 1);  // delete from comments list

    this.userService.removeComment(content, this.currentId).subscribe(
      data => {
      //  console.log("remove comment", data)
      },
      err => {
        
      });
  }

  // functions for recording user interactions
  onClickPDF() {
    // console.log("on click pdf file");
    let interaction = this.initializeNewInteraction();
    interaction.element=InteractionElements.PDFTEXT;
    interaction.interactionType=InteractionTypes.CLICK;
    this.addInteraction(interaction);
  }

  onClickProfile() {
    // console.log("on click  profile");
    let interaction = this.initializeNewInteraction();
    interaction.element=InteractionElements.PROFILE;
    interaction.interactionType=InteractionTypes.CLICK;
    this.addInteraction(interaction);
  }

  onClickComment() {
    // console.log("on click  Comment");
    let interaction = this.initializeNewInteraction();
    interaction.element=InteractionElements.COMMENT;
    interaction.interactionType=InteractionTypes.CLICK;
    this.addInteraction(interaction);
  }

  onClickRating() {
    // console.log("on click  Rating");
    let interaction = this.initializeNewInteraction();
    interaction.element=InteractionElements.RATING;
    interaction.interactionType=InteractionTypes.CLICK;
    this.addInteraction(interaction);
  }

 



  onPDFPageChange() {
    // console.log("on page change");
    let interaction = this.initializeNewInteraction();
    interaction.element=InteractionElements.PDFTEXT;
    interaction.interactionType=InteractionTypes.CHANGE_PDF_PAGE;
    this.addInteraction(interaction);
  }


  formatAttribute(attr) {
    if (this.tour) {
      let attr_values = {
        "Name": "Jane Doe",
        "High School Code": "000000",
        "GPA": "3.6",
        "Class Rank": "10 / 100",
        "SAT Score": "1500 ( Reading & Writing: 750, Math: 750)",
        "Gender": "Female",
        "Race": "White"
      }
      return attr_values[attr];
    }
    
    return this.utilsService.formatAttribute(attr, this);
  }

  formatComment(content) {
    return this.utilsService.formatComment(content);
  }

  getAssignedApplications() {
    this.userService.getAssignedApplications().subscribe(
      data => {
        let count = 0;
        for(let i = 0; i < data.length; i++) {
          this.assignedApplicants[data[i].applicant_id] = data[i];
          if(data[i].viewed) {
            count++;
          }
        }

        this.numAssigned = data.length;
        this.numAssignedReviewed = count;
        // if(this.assignedApplicants[this.currentId])
        //   this.reviewed = this.assignedApplicants[this.currentId]['viewed'];
        // console.log("assigned application:", this.assignedApplicants)
        // console.log(this.assignedApplicants)
        this.getApplications();


   
       
      },
      err => {

      }
    );
  } 

  compareName(a,b) {
    const lastNameA = a.NAME_LAST.toUpperCase();
          const lastNameB = b.NAME_LAST.toUpperCase();
          const firstNameA = a.NAME_FIRST.toUpperCase();
          const firstNameB = b.NAME_FIRST.toUpperCase();

          if(lastNameA < lastNameB) {
            return -1;
          }
          if(lastNameA > lastNameB) {
            return 1;
          }
          if(lastNameA == lastNameB) {
            if(firstNameA < firstNameB) {
              return -1;
            }
            if(firstNameA > firstNameB) {
              return 1;
            }
            return 0;
          }
  }

  generateOrder(id, array) {
    const random = d3.randomLcg(id);
    const shuffle = d3.shuffler(random);
    shuffle(array);
  }

  getApplications() {
    // get applicant id and name
    this.applicationService.getApplications().subscribe(
      data => {
        
        let clonedData = JSON.parse(JSON.stringify(data))
        // console.log(clonedData,this.generateOrder(this.userId, data))
        this.generateOrder(this.userId, data); // randomize the order of applicants
        // console.log(data)
        let assignedIds = Object.keys(this.assignedApplicants);
        let index = 0;
        
        this.numApplications = data.length;
        this.applicants = data;
        for(let i = 0; i < data.length; i++) {
                   
          if(assignedIds.includes(data[i].id.toString())) {
            this.assignedApplicantsList.push(data[i]);
            this.applicantsDict[data[i].id] = data[i];
            // this.applicantsDict[data[i].id]['idx'] = index++;
          }
          // else {
          //   this.otherApplicantsList.push(data[i]);
          // }
        }

        // Sort the applicants by last name, first name
        // this.assignedApplicantsList.sort(this.compareName);

        // add index to the applicantsDict
        for(let i = 0; i < this.assignedApplicantsList.length; i++) {
          this.applicantsDict[this.assignedApplicantsList[i].id]['idx'] = index++;
        }



        this.applicants = this.assignedApplicantsList

      
        this.minId = this.applicants[0]['id'];
       
        this.maxId = this.applicants[this.applicants.length - 1]['id'];
     
      },
      err => {

      }
    );
  } 

  getUserInfo() {
    this.userService.getUserInfo().subscribe(
      data => { 
        this.userId = data['user_id'];
        this.userName = data['user_name']; // TODO maybe change to You or remove 
        this.getAssignedApplications();
      },
      err => {
        
      });

  }

  getUserSetting() {
    this.userService.getUserSetting().subscribe(
      data => {
        data = data[0];
        // console.log("user setting: ", data)
       
        for(let i = 0; i < this.dataConfig.profileAttributeListAll.length; i++) {
          if(data[this.dataConfig.profileAttributeListAll[i]] == 1) {
            this.selectedAttributeList.push({"id":i+1,"itemName": this.dataConfig.profileAttributeListAll[i]})
            this.userSetting[this.dataConfig.profileAttributeListAll[i]] = 1;
          }
          else {
            this.userSetting[this.dataConfig.profileAttributeListAll[i]] = 0;
          }
        }
      },
      err => {
        
      });

  }

  getSelectedApplication(){
    this.applicationService.getApplication(this.currentId).subscribe(
      data => {
        this.selectedObject = data;
        // console.log("selected object", data);
        // this.getApplicantFile();
      },
      err => {
        
      });
  }

  getComments() {
    this.userService.getComments(this.currentId).subscribe(
      data => {
        data.forEach(element => {
          let postTime = new Date(element['add_timestamp']).toISOString().slice(0, 19).replace('T', ' ');
          let comment ={username:this.userName, content: element.content, postTime: postTime};
          this.comments.unshift(comment);

        });
      },
      err => {
        
      });
  }

  getRatings() {
    this.userService.getRatings(this.currentId).subscribe(
      data => {
       
        if(data) {
          this.ratings = data;
         
        }
        
      },
      err => {
        
      });
  }
  onClickPDFLink(docType) {
    this.activeLink = docType;
    let interaction = this.initializeNewInteraction();
    interaction.element=InteractionElements.PDFTAB;
    interaction.interactionType=InteractionTypes.CLICK;
    this.addInteraction(interaction);
    this.getPDF(this.pdfMapping[docType]);

  }

  getPDF(docType) {
  
    this.applicationService.getPDF(docType, this.currentId).subscribe(
      (data : Blob)=> { 
          // this.pdfUrl = null;
          var file = new Blob([data], { type: 'application/pdf' })
          // var fileURL = URL.createObjectURL(file);
          this.pdfUrl = URL.createObjectURL(file);
          // this.pdfUrl = file;
      },
      err => {
        // console.log(err)
        
      });

  }





  addComment(content, postTime) {
    let comment = {'applicant_id': this.currentId, 'content': content, 'add_timestamp': postTime}
    // console.log(comment)
    this.userService.addComment(comment).subscribe(
      data => {
       
      },
      err => {
        
      });
  }

  updateRating(field, value) {
    let rating= {'applicant_id': this.currentId, [field]: value, 'page': 'rating'}

    this.userService.updateRating(field, rating).subscribe(
      data => {
       
      },
      err => {
        
      });
  }

  updateUserReviewed(reviewed) {
    this.userService.updateUserReviewed(this.currentId, reviewed).subscribe(
      data => {
       
      },
      err => {
        
      });
  }

  updateUserSetting() {
   
    this.userService.updateUserSetting(this.userSetting).subscribe(
      data => {
       
      },
      err => {
        
      });

  }

  updateCurrentId() {
    this.userService.updateUserStatus(this.currentId).subscribe(
      data => {
       
      },
      err => {
        
      });
  }


  addInteraction(interaction) {
    // console.log(interaction);
    this.userService.addInteraction(interaction).subscribe(
      data => {
       
      },
      err => {
        
      });



  }

  getReviewedApplicants() {
    this.userService.getReviewedApplicants().subscribe(
      data => { 
       
        
        for(let i = 0; i < data.length; i++) {
        
          this.reviewedApplicants[data[i].applicant_id] = data[i];
        }

        this.numReviewed = data.length;

        if(this.reviewedApplicants[this.currentId]) {
          this.reviewed = true;
        }
        
      },
      err => {
        
      });
  }

  // sliderTooltipFormatter(filterVar) {

  // }
  formatRatingLabel(value: number): string {
    if (value == 0) {
      return '0: Clearly fails requirement';
    }
    else if (value == 1) {
      return '1: Likely fails requirement';
    }
    else if (value == 2) {
      return '2: Likely meets requirement';
    }

    else if (value == 3) {
      return '3: Clearly meets requirement';
    }
    else if (value == 4) {
      return '4: Likely exceeds requirementt';
    }
    else if (value == 5) {
      return '5: Clearly exceeds requirement';
    }
    else return "";
  }



  deleteRating(id) {
    this.userService.deleteRating(this.currentId ).subscribe(
      data => {
       
      },
      err => {
        
      });
  }

  initializeNewInteraction() {
  
    let interaction = new Interaction();
    interaction.applicantId = this.currentId;
    interaction.pdfType = this.pdfMapping[this.activeLink];
    interaction.interactionType ="";
    interaction.element="";
    interaction.timeStamp = new Date().getTime(); // timestamp in ms
    return interaction;
  }

  updateReviewStatus(): void {
    this.reviewStatusService.setVariable(true);
  }
}

