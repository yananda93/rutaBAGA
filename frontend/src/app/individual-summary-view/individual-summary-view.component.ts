import { Component, OnInit, AfterViewInit, ElementRef, ViewChild ,Inject } from '@angular/core';
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as seedrandom from 'seedrandom';
import { ResizedEvent } from 'angular-resize-event';
import { RatingFormatter, GREFormatter, GPAFormatter } from '../_helpers/filterValueFormatter';
import * as bootstrap from "bootstrap";
import {JoyrideService} from 'ngx-joyride';
import {TourStatusService} from '../_services/tourstatus.service'

// import {MatDialog} from '@angular/material/dialog';



import {DataConfig, ScatterPlotConfig} from '../config'

import { Router } from '@angular/router';
import { UtilsService } from '../_services/utils.service';
import { UserService} from '../_services/user.service'
import { ApplicationService} from '../_services/application.service'
import { ColorDomains, ColorRanges, LegendLabels, NAVAL } from '../constants'
import { Comment } from '../_models/comment';

import { VISInteraction } from '../_models/interaction';
import { InteractionTypes, InteractionElements } from '../constants'

import {FinishedService} from '../_services/finished.service'


@Component({
  selector: 'app-individual-summary-view',
  templateUrl: './individual-summary-view.component.html',
  styleUrls: ['./individual-summary-view.component.scss']
})
export class IndividualSummaryViewComponent implements OnInit {
  objectKeys;
  objectValues;
  dataConfig;
  scatterPlotConfig;
  ratingFactors;
  ratingVariablesMap;
  ratingVariablesTooltip;

  nameTooltip;
  numShown;

  reviewedApplicants = {};  

  ratings= {
    applicant_id: null,
    teaching: 0,
    academic: 0,
    research: 0,
    communication: 0,
    recommendation: null
  };
  recommendation = "Overall Rating";

  ratingsAll = {};

  currentId = 0;
  selectedObject={}; 
  userName;
  userSetting = {};
  userStatus;
  userId;

  selectedAttributeList = [];
  attributeList = [];

  comments: Array<Comment> = []; 

  NAChecked=[];

  averageTotalTime;
  averageTotalTimeFemale;
  averageTotalTimeMale;
  averageTotalTimeNonBinary;
  averageTotalTimeWhite;
  averageTotalTimeBlack;

  averageRatingFemale;
  averageRatingMale;
  averageRatingNonBinary;
  averageRatingWhite;
  averageRatingBlack;



  maxFocusTime;
  minFocusTime;
  // ['Personal Statement', 'Resume', 'Recommendation Letter 1', 'Recommendation Letter 2', 'Transcripts']
  avgFocusTime = { "Personal Statement": 0, "Resume":0, "LOR 1": 0, "LOR 2":0, "Transcripts": 0};
  individualFocusTime = { "Personal Statement": 0, "Resume":0, "LOR 1": 0, "LOR 2":0, "Transcripts": 0};
  maxComponentFocusTime;
  docTypes = ['Personal Statement', 'Resume', 'LOR 1', 'LOR 2', 'Transcripts']
  docTypesMapping ={
    'Personal Statement': 'PS', 'Resume': 'Resume', 'LOR 1': 'LOR1', 'LOR 2': 'LOR2', 'Transcripts': 'Transcripts'
  }
  


  rateDomain = ColorDomains.RECOMMENDATION;
  genderDomain = ColorDomains.GENDER;
  raceDomain = ColorDomains.RACE;

  rateRange = ColorRanges.RECOMMENDATION;
  genderRange = ColorRanges.GENDER;
  raceRange = ColorRanges.RACE;

  rateLabels = LegendLabels.RECOMMENDATION;
  genderLabels = LegendLabels.GENDER;
  raceLabels = LegendLabels.RACE;

  loading;


  // ratingList = ['academic', 'research', 'teaching', 'communication'];

  ratingFormatter;
  GPAFormatter;
  GREFormatter;

  hoverTimer;



  genderPlotHeight;
  racePlotHeight;

  reviewedApplicantsList = [];


  @ViewChild('plotDialog') plotDialogElement: ElementRef;
 

  constructor( 
    private utilsService: UtilsService,
    private userService: UserService,
    private applicationService: ApplicationService,
    private router: Router,
    private readonly joyrideService: JoyrideService,
    private finishedService: FinishedService,
    private tourStatusService: TourStatusService,
    ) { 
  }

  ngOnInit(): void {
    
    this.ratingFormatter = new RatingFormatter();
    this.GPAFormatter = new GPAFormatter();
    this.GREFormatter = new GREFormatter();

    this.getUserStatus();
    this.getUserSetting();
    this.getReviewedApplicants();

    this.objectKeys = Object.keys;
    this.objectValues = Object.values;
    
    this.dataConfig = DataConfig;
    
    this.ratingFactors = this.dataConfig.ratingVariables;
    this.ratingVariablesMap = this.dataConfig.ratingVariablesMap;
    this.ratingVariablesTooltip = this.dataConfig.ratingVariablesTooltip;

    this.loading = true;

    this.getUserVisSetting();

    

  }

 

  updateBarChart() {
    
    let context = this;
    let data = [];
    
    if( Object.keys(context.selectedObject).length > 0) {
      for(let property in context.individualFocusTime) {
        context.individualFocusTime[property] = context.selectedObject[property];
      }
    }
    for(let property in context.avgFocusTime) {
      data.push({"Component":property, "Average":context.avgFocusTime[property], "Individual": context.individualFocusTime[property]});
    }


    const container = '#focus_time';
    $(container).empty();
    const width = $(container).width();
    const height = $(container).parent().height();
    
    let svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    let plotMargins = {
        top: 20,
        bottom: 30,
        left:60,
        right: 50
    };
    
    let plotGroup = svg.append('g')
                         .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);
                  
    let plotWidth = width*0.85 - plotMargins.left - plotMargins.right;
    let plotHeight = height - plotMargins.top - plotMargins.bottom;




    let yPos = plotMargins.top +  plotHeight/2;

    svg.append("text")
    .attr("transform", `translate(10,${yPos}) rotate(-90)`)
    .attr("dy", "0.5em")
    .style("text-anchor", "middle")
    .style("font-size", "14px") 
    .text("Time Spent (minute)");      

    let xScale = d3.scaleBand()
        .domain(Object.keys(context.avgFocusTime))
        .padding(0.3)
        .range([0, plotWidth])
    

    let yScale = d3.scaleLinear()
        .domain([0, context.maxComponentFocusTime])
        .range([plotHeight, 0]);
    let xAxis = d3.axisBottom(xScale)
          .tickSize(0);
    let yAxis = d3.axisLeft(yScale);

    let subgroups = ["Average", "Individual"];
    let xSubGroup = d3.scaleBand()
          .domain(subgroups)
          .range([0, xScale.bandwidth()]);
    let colorScale = d3.scaleOrdinal<string>()
          .domain(subgroups)
          .range(["#9ecae1", "#3182bd"])
    let xAxisGroup = plotGroup.append("g")
          .attr("transform", `translate(0, ${plotHeight})`)
          .call(xAxis)
    let yAxisGroup = plotGroup.append("g")
          .call(yAxis)

    xAxisGroup.selectAll(".tick text")
              .call(context.wrap, xScale.bandwidth());

    let legend = svg.selectAll(".legend")
      .data(subgroups)
      .enter().append("g")
      // .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(20," + (i+2) * 20  + ")"; });

    const padding_left = 20;


    legend.append("rect")
      .attr("x", plotWidth + plotMargins.left + 5)
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", d => colorScale(d));

    legend.append("text")
      .attr("x", plotWidth + plotMargins.left + 30)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

    let bars = plotGroup.append("g")
             .selectAll("g")
             .data(data)
             .join("g")
               .attr("transform", d => `translate(${xScale(d["Component"])}, 0)`)

    bars.selectAll("rect")
             .data(function(d) {return subgroups.map(function(key) {return {key: key, value: d[key]};});})
             .join("rect")
                .attr("x", d => xSubGroup(d.key))
                .attr("y",  d =>{
                    return yScale(d.value);
             
                })
                .attr("width", xSubGroup.bandwidth())
                .attr("height", d => {

                    if(d.value == null)
                      return plotHeight-yScale(0);
                  
                    return plotHeight - yScale(d.value);
                 
                  })
                .attr("fill", d => colorScale(d.key));

    bars.selectAll("text")
      .data(function(d) {return subgroups.map(function(key) {return {key: key, value: d[key]};});})
      .join("text")
        .attr("x", d => xSubGroup(d.key))
        .attr("y", d => {
            if(d.value == null) {
              return yScale(0);
            }
            return yScale(d.value);
         
        })
        .style("font-size", "12px")
        .text(function(d) {

            if(Object.keys(context.selectedObject).length == 0 && d.key=="Individual") {
              return "";
            }
            if(d.value == null) {
              return "N/A"
            }
    
            return d.value.toFixed(2);
          
        })
        

  }


  updateLegend() {
    const legendContainer = '#scatter_plot_legend';
    $(legendContainer).empty();
    let svgLegend = d3.select(legendContainer)
    .append("svg")
    .attr("width", $(legendContainer).width())
    .attr("height",$(legendContainer).height())

    // define in config: scatterplot.individual.lengdWidth and height
    let legendWidth = 120
    let legendHeight = 13

    let cx = 15; // also put in config
    let r = 6;

    let colors;
    let labels;
    if(this.dataConfig.colorEncoding == 'rate') {
      colors =  this.rateRange;
      labels = this.rateLabels;
    }
    else if(this.dataConfig.colorEncoding == 'race') {
      colors =  this.raceRange;
      labels = this.raceLabels;
    }
    else if(this.dataConfig.colorEncoding == 'gender'){
      colors =  this.genderRange;
      labels = this.genderLabels;
    }
    else{
      labels = [];
    }

    for(let i = 0; i < labels.length; i++) {
      svgLegend.append("circle")
      .attr("cx",cx)
      .attr("r", r)
      .attr("cy", legendHeight*(i*2+1))
      .style("fill", colors[i])
      .style('fill-opacity',0.8);
      

      svgLegend.append("text")
      .attr("x",30 )
      .attr("y", legendHeight*(i*2+1) + 4)
      .text( labels[i])
      .style("font-size","12px");
    }


    let rectHeight = legendHeight*labels.length*2;
    if(this.dataConfig.showFocusTime) {
      rectHeight += legendHeight*4;

      let minR = 4;
      let maxR = 8;
      svgLegend.append("circle")
      .attr("cx", 20)
      .attr("cy", (labels.length*2 + 1)*legendHeight)
      .attr("r", minR)
      .attr('fill','white')
      .style('stroke','black');
      svgLegend.append("circle")
      .attr("cx", legendWidth + 15 - maxR)
      .attr("cy",(labels.length*2 + 1)*legendHeight)
      .attr("r", maxR)
      .attr('fill','white')
      .style('stroke','black');

      svgLegend.append("text")
      .attr("x",4)
      .attr("y", (labels.length*2 + 3)*legendHeight)
      .style("font-size", "12px")
      .text("Less Focus");

      svgLegend.append("text")
      .attr("x",legendWidth*0.8 )
      .attr("y",  (labels.length*2 + 3)*legendHeight)
      .style("font-size", "12px")
      .text("More Focus"); 
    }
    svgLegend.append("rect")
    .attr("x", 0)
    .attr("width", legendWidth+42)
    .attr("height", rectHeight)
    .style("fill", "none")
    .style('stroke','grey')
  }
  


  onRatingChange(event, factor) {
    let interaction = this.initializeNewInteraction();
    interaction.element=InteractionElements.RATING;
    interaction.interactionType=InteractionTypes.CLICK;
    interaction.recommendation=this.selectedObject['recommendation'];
    interaction.focusTime=this.selectedObject['focusTime'];
    this.addInteraction(interaction);

    this.dataConfig['datasetDict'][this.currentId][factor] = event.value;
    this.updateRating(factor, event.value);
  }

  onRadioChange(event) {
    let interaction = this.initializeNewInteraction();
    interaction.element=InteractionElements.RECOMMENDATION;
    interaction.interactionType=InteractionTypes.CLICK;
    interaction.recommendation=this.selectedObject['recommendation'];
    interaction.focusTime=this.selectedObject['focusTime'];
    this.addInteraction(interaction);

    this.dataConfig['datasetDict'][this.currentId]['recommendation'] = event.value;
    this.initBoxplots();

    this.updateRating("recommendation",Number(event.value));

  }



    onSelectAttribute(event: any) {
      this.userSetting[event.itemName] = 1;
      this.updateUserSetting();
    }
  
    onDeSelectAttribute(event: any) {
     
      this.userSetting[event.itemName] = 0;
      this.updateUserSetting();
    }
  
    onSelectAllAttribute(event: any) {
      for (const key of Object.keys(this.userSetting)) {
        this.userSetting[key] = 1;
      }
      this.updateUserSetting();
    }
    onDeSelectAllAttribute(event: any) {
      
      for (const key of Object.keys(this.userSetting)) {
        this.userSetting[key] = 0;
      }
      this.updateUserSetting();
    
    }

  formatAttribute(attr) {
    return this.utilsService.formatAttribute(attr, this);
  }


  formatComment(content) {
    return this.utilsService.formatComment(content);
  }

  receiveComment(event: any) {
    let interaction = this.initializeNewInteraction();
          interaction.element=InteractionElements.COMMENT;
          interaction.interactionType=InteractionTypes.CLICK;
          interaction.recommendation=this.selectedObject['recommendation'];
          interaction.focusTime=this.selectedObject['focusTime'];
          this.addInteraction(interaction);

    this.comments.unshift(event);
    this.addComment(event.content, event.postTime);
  }

  addComment(content, postTime) {
    let comment = {'applicant_id': this.currentId, 'content': content, 'add_timestamp': postTime}
    this.userService.addComment(comment).subscribe(
      data => {
       
      },
      err => {
        
      });
  }


  getUserStatus() {
    this.userService.getUserStatus().subscribe(
      data => {
  
        this.userStatus = data;
        // console.log(this.userStatus)
        // this.currentId = data.current_id + 1;
      },
      err => {
        // this.errorMessage = err.error.message;
      });
  }


  generateOrder(id, array) {
    const random = d3.randomLcg(id);
    const shuffle = d3.shuffler(random);
    shuffle(array);
  }

  getReviewedApplicants() {
    this.userService.getReviewedApplicants().subscribe(
      data => { 
        if(data && data.length > 0) {
          this.userId = data[0].user_id;
        }
        
        // let clonedData = JSON.parse(JSON.stringify(data))
        // let userId = 
        // console.log(clonedData, data)
        // this.generateOrder(this.user, data);
        for(let i = 0; i < data.length; i++) {
          delete data[i].id;
          this.reviewedApplicants[data[i].applicant_id] = data[i];
        }

        this.getApplications();

        this.getFocusTime(); // TODO: move this to getApplications()
        
        
      
      },
      err => {
        
      });
  }

  getApplications() {
    // get applicant id and name
    this.applicationService.getApplications().subscribe(
      data => {
        this.generateOrder(this.userId, data); // randomize the order of applicants
        let reviewedIds = Object.keys(this.reviewedApplicants);
        // console.log(reviewedIds,data)
        let index = 0;
        
        for(let i = 0; i < data.length; i++) {
                   
          if(reviewedIds.includes(data[i].id.toString())) {
            this.reviewedApplicantsList.push(data[i]);
          }
        }
     
      },
      err => {

      }
    );
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

  getFocusTime() {
    this.userService.getFocusTime().subscribe(
      data => { 

        if(data) {      
          let context = this;
          for(const row of data) {
      
            if (Object.keys(context.reviewedApplicants).includes(row['applicant_id'].toString())) {
            
              for (const doctype of context.docTypes) {
              
                context.reviewedApplicants[row['applicant_id']][doctype] = row[context.docTypesMapping[doctype]]

              context.reviewedApplicants[row['applicant_id']]['focusTime'] = row['total_time']
            }
          }
        }
      let dataset = Object.values(context.reviewedApplicants);
  
        context.maxFocusTime = d3.max(dataset, function(d){ return parseFloat(d["focusTime"]) });
        context.minFocusTime = d3.min(dataset, function(d){ return parseFloat(d["focusTime"]) });


       

     
        context.averageTotalTime = d3.mean(dataset, function(d){ return parseFloat(d["focusTime"])});
        
        let genderGroup = d3.group(dataset, d=>d['GENDER']);
        // console.log(dataset,genderGroup.get('F'))
        if (genderGroup.get('Female')) {
          context.averageTotalTimeFemale = d3.mean(genderGroup.get('Female'), function(d){ return parseFloat(d["focusTime"])}).toFixed(2);
          context.averageRatingFemale = d3.mean(genderGroup.get('Female'), function(d){ return parseFloat(d["recommendation"])}).toFixed(0);
        }

        if(genderGroup.get('Male')) {
          context.averageTotalTimeMale = d3.mean(genderGroup.get('Male'), function(d){ return parseFloat(d["focusTime"])}).toFixed(2);
          context.averageRatingMale = d3.mean(genderGroup.get('Male'), function(d){ return parseFloat(d["recommendation"])}).toFixed(0);
        }

        if(genderGroup.get('Non-binary')) {
          context.averageTotalTimeNonBinary = d3.mean(genderGroup.get('Non-binary'), function(d){ return parseFloat(d["focusTime"])}).toFixed(2);
          context.averageRatingNonBinary = d3.mean(genderGroup.get('Non-binary'), function(d){ return parseFloat(d["recommendation"])}).toFixed(0);
        }
        
        // console.log("time",dataset,genderGroup,context.averageTotalTimeFemale,context.averageTotalTimeMale,context.averageTotalTimeNonBinary)

        
        let raceGroup = d3.group(dataset, d=>d['RACE']);

        if(raceGroup.get('White')) {
          context.averageTotalTimeWhite = d3.mean(raceGroup.get('White'), function(d){ return parseFloat(d["focusTime"])}).toFixed(2);
          context.averageRatingWhite = d3.mean(raceGroup.get('White'), function(d){ return parseFloat(d["recommendation"])}).toFixed(0);
        }

        if(raceGroup.get('Black')) {
          context.averageTotalTimeBlack = d3.mean(raceGroup.get('Black'), function(d){ return parseFloat(d["focusTime"])}).toFixed(2);
          context.averageRatingBlack = d3.mean(raceGroup.get('Black'), function(d){ return parseFloat(d["recommendation"])}).toFixed(0);
        }
        

        for(const property in context.avgFocusTime) {
          context.avgFocusTime[property] = d3.mean(dataset, d => {
            return d[property];
          });
        }
 
        context.maxComponentFocusTime = d3.max(dataset, function(d) {return Math.max((d["Resume"]), (d["Personal Statement"]), (d["LOR 1"]), (d["LOR 2"]), (d["Transcripts"]));});

        this.loading = false;
        if(Object.keys(context.reviewedApplicants).length>0) {

          this.initBoxplots();
          this.ratingDensityPlot();
        //   this.updateBarChart();
          
          context.dataConfig['datasetDict'] = context.reviewedApplicants; 
          if(this.userStatus.summarytoured == 0) {
            // this.updateVisitStatus();
            // this.updateStatus();
            
            this.startTour();
          }
          // this.startTour();
          
        }
        else {
          alert("You haven't rated any applications.");
          // this.router.navigate(['home']);
        }
      }
      else {
        this.loading = false;
        alert("You haven't reviewed any applications.");
        // this.router.navigate(['home']);
      }
      
    },
      err => {
        
      });

  }

  getUserSetting() {
    this.userService.getUserSetting().subscribe(
      data => {
        data = data[0];
       
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

  updateUserSetting() {
    this.userService.updateUserSetting(this.userSetting).subscribe(
      data => {
       
      },
      err => {
        
      });

  }



  updateRating(field, value) {
    let rating= {'applicant_id': this.currentId, [field]: value, 'page': 'summary'};
    this.userService.updateRating(field, rating).subscribe(
      data => {
       
      },
      err => {
        
      });
  }



  
  removeComment(index){
    let content = this.comments[index]['content'];
    this.comments.splice(index, 1);  // delete from comments list

    this.userService.removeComment(content, this.currentId).subscribe(
      data => {
 
      },
      err => {
        
      });
  }

  onResizePlots(event){
    this.initBoxplots();
    this.ratingDensityPlot();
  }


  addInteraction(interaction) {
    this.userService.addVISInteraction(interaction).subscribe(
      data => {
       
      },
      err => {
        
      });

  }

  initializeNewInteraction() {
  
    let interaction = new VISInteraction();
    interaction.applicantId = this.currentId;
    interaction.interactionType ="";
    interaction.element="";
    interaction.recommendation=null;
    interaction.xVar=this.dataConfig.xVar;
    interaction.yVar=this.dataConfig.yVar;
    interaction.timeEncoding=this.dataConfig.showFocusTime?1:0;
    interaction.colorEncoding=this.dataConfig.colorEncoding;
    interaction.focusTime=this.selectedObject['focusTime'];
    interaction.plotType=this.dataConfig.activePlot;
    interaction.timeStamp = new Date().getTime(); // timestamp in ms
    return interaction;
  }

  initBoxplots() {
    let data = Object.values(this.reviewedApplicants);
    this.numShown = data.length;
    let sumstat = this.getSumStatData('GENDER', 'focusTime');
    let sumstatRace = this.getSumStatData('RACE', 'focusTime');

    let sumstatRatingGender = this.getSumStatData('GENDER', 'recommendation');
    let sumstatRatingRace = this.getSumStatData('RACE', 'recommendation');

    const containerGender = '#boxplot_gender';
    const containerRace = '#boxplot_race';

    const containerGenderRating = '#rating_boxplot_gender';
    const containerRaceRating = '#rating_boxplot_race';

    $(containerGender).empty();
    $(containerRace).empty();

    $(containerGenderRating).empty();
    $(containerRaceRating).empty();

    let genderCategory = [ 'Non-binary', 'Male', 'Female',];
    let raceCategory = ['White', 'Black']


    let numGender = genderCategory.length + 1;
    let numRace = raceCategory.length + 1;

    this.genderPlotHeight = (numGender/(numGender + numRace)*100) +'%';
    this.racePlotHeight = (numRace/(numGender + numRace)*100) +'%';

    let ratio = 1
    const widthGender = $(containerGender).width()*ratio;
    const heightGender = $(containerGender).height();

    const widthRace = $(containerRace).width()*ratio;
    const heightRace = $(containerRace).height();

 
    let context = this;
    let svgGender = d3.selectAll(containerGender)
        .append('svg')
        .attr('width', widthGender)
        .attr('height', heightGender);
      
    let svgRace = d3.select(containerRace)
        .append('svg')
        .attr('width', widthRace)
        .attr('height', heightRace);

    let svgGenderRating = d3.selectAll(containerGenderRating)
        .append('svg')
        .attr('width', widthGender)
        .attr('height', heightGender);
      
    let svgRaceRating = d3.select(containerRaceRating)
        .append('svg')
        .attr('width', widthRace)
        .attr('height', heightRace);

    let plotMargins = {
        top:10,
        bottom:50,
        left: 80,
        right: 30
    };


    let plotGroupGender = svgGender.append('g')
        .attr('transform', `translate(${plotMargins.left},${plotMargins.top })`);

    let plotGroupRace = svgRace.append('g')
        .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);


    let plotGroupGenderRating = svgGenderRating.append('g')
        .attr('transform', `translate(${plotMargins.left},${plotMargins.top })`);

    let plotGroupRaceRating = svgRaceRating.append('g')
        .attr('transform', `translate(${plotMargins.left},${plotMargins.top})`);

    let yPos = heightGender/2 - plotMargins.top;
    let yPosRace = heightRace/2;
    svgGender.append("text")
        .attr("transform", `translate(10,${yPos}) rotate(-90)`)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px") 
        .style("font-weight", 500) 
        .text("Gender");    

    svgGender.append("text")
        .attr("x", (widthGender + plotMargins.left - plotMargins.right)/2)
        .attr("y", heightGender - 10)
        .style("text-anchor", "middle")
        .style("font-size", "14px") 
        .style("font-weight", 500) 
        .text("Time Spent (minute)");   


    svgRace.append("text")
        .attr("transform", `translate(10,${yPosRace}) rotate(-90)`)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px") 
        .style("font-weight", 500) 
        .text("Race"); 

    svgRace.append("text")
        .attr("x", (widthRace + plotMargins.left - plotMargins.right)/2)
        .attr("y", heightRace - 10)
        .style("text-anchor", "middle")
        .style("font-size", "14px") 
        .style("font-weight", 500) 
        .text("Time Spent (minute)"); 

    svgGenderRating.append("text")
        .attr("transform", `translate(10,${yPos}) rotate(-90)`)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px") 
        .style("font-weight", 500) 
        .text("Gender"); 
        
    svgGenderRating.append("text")
        .attr("x", (widthGender + plotMargins.left - plotMargins.right)/2)
        .attr("y", heightGender - 10)
        .style("text-anchor", "middle")
        .style("font-size", "14px") 
        .style("font-weight", 500) 
        .text("Overall Rating");   


    svgRaceRating.append("text")
        .attr("transform", `translate(10,${yPosRace}) rotate(-90)`)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "14px") 
        .style("font-weight", 500) 
        .text("Race"); 

    svgRaceRating.append("text")
        .attr("x", (widthRace + plotMargins.left - plotMargins.right)/2)
        .attr("y", heightRace - 10)
        .style("text-anchor", "middle")
        .style("font-size", "14px") 
        .style("font-weight", 500) 
        .text("Overall Rating");   


    let yScale = d3.scaleBand()
        .range([heightGender - plotMargins.top - plotMargins.bottom, 0])
        .domain(genderCategory)
        .padding(.4);

    let yScaleRace = d3.scaleBand()
        .range([heightRace - plotMargins.top - plotMargins.bottom, 0])
        .domain(raceCategory)
        .padding(.4);

    plotGroupGender.append('g')
        .attr("class", "y axis")
        .call( d3.axisLeft(yScale).tickSizeOuter(0).tickSizeInner(-widthGender + plotMargins.left + plotMargins.right));

    plotGroupRace.append('g')
    .attr("class", "y axis")
        .call( d3.axisLeft(yScaleRace).tickSizeOuter(0).tickSizeInner(-widthGender + plotMargins.left + plotMargins.right));  

    plotGroupGenderRating.append('g')
    .attr("class", "y axis")
        .call( d3.axisLeft(yScale).tickSizeOuter(0).tickSizeInner(-widthGender + plotMargins.left + plotMargins.right));

    plotGroupRaceRating.append('g')
    .attr("class", "y axis")
        .call( d3.axisLeft(yScaleRace).tickSizeOuter(0).tickSizeInner(-widthGender + plotMargins.left + plotMargins.right));  

    let xScale = d3.scaleLinear()
        .range([0, widthGender - plotMargins.left - plotMargins.right])
        .domain([0, context.maxFocusTime]); 

    let xScaleRace = d3.scaleLinear()
    .range([0, widthRace - plotMargins.left - plotMargins.right])
    .domain([0, context.maxFocusTime]); 

    let xScaleRating = d3.scaleLinear()
        .range([0, widthGender - plotMargins.left - plotMargins.right])
        .domain([0,100]); 


    plotGroupGender.append('g')
        .attr('transform', `translate(${0},${heightGender - plotMargins.top - plotMargins.bottom})`)
        .call(d3.axisBottom(xScale));

    plotGroupRace.append('g')
        .attr('transform', `translate(${0},${heightRace - plotMargins.top - plotMargins.bottom})`)
        .call(d3.axisBottom(xScaleRace));

    plotGroupGenderRating.append('g')
        .attr('transform', `translate(${0},${heightGender - plotMargins.top - plotMargins.bottom})`)
        .call(d3.axisBottom(xScaleRating));

    plotGroupRaceRating.append('g')
        .attr('transform', `translate(${0},${heightRace - plotMargins.top - plotMargins.bottom})`)
        .call(d3.axisBottom(xScaleRating));

    let bandWidth = yScale.bandwidth();
    let bandWidthRace = yScaleRace.bandwidth();

    let numBins = 5;
    let histogram = d3.bin()
    .domain([0, context.maxFocusTime])
    .thresholds(xScale.ticks(numBins))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
    .value(d => d)
    

    let histogramRating = d3.bin()
    .domain([0, 100])
    .thresholds(xScaleRating.ticks(numBins))   
    .value(d => d)

    let genderColorScale = d3.scaleOrdinal<string>()
      .domain([...sumstat.keys()].sort())
      .range(["#73c378","#2f984f","#036429","#00441b"])

    let raceColorScale = d3.scaleOrdinal<string>()
      .domain([...sumstatRace.keys()].sort())
      .range(["#fc8a6b","#ef4533","#d92723","#bb151a","#970b13","#67000d"])

    let histSumstat = Array.from(d3.group(data, d => d['GENDER']), ([key, values]) => {
        let input = values.map(d => d['focusTime']); 
        let bins = histogram(input); 
        return { key, value: bins }; 
    });

    let histSumstatRace = Array.from(d3.group(data, d => d['RACE']), ([key, values]) => {
        let input = values.map(d => d['focusTime']); 
        let bins = histogram(input);
        return { key, value: bins };
    });

    let histSumstatRating = Array.from(d3.group(data, d => d['GENDER']), ([key, values]) => {
        let input = values.map(d => d['recommendation']); 
        let bins = histogramRating(input); 
        return { key, value: bins }; 
    });

    let histSumstatRaceRating = Array.from(d3.group(data, d => d['RACE']), ([key, values]) => {
        let input = values.map(d => d['recommendation']); 
       
        let bins = histogramRating(input); 
        return { key, value: bins }; 
    });


    let maxNum = 0
    for ( let i in histSumstat ){
        let allBins = histSumstat[i].value;
        let lengths = allBins.map(function(a){return a.length;});
        let longest = d3.max(lengths);
        if (longest > maxNum) { 
            maxNum = longest;
        }
    }

    let maxNumRace = 0
    for ( let i in histSumstatRace ){
        let allBins = histSumstatRace[i].value;
        let lengths = allBins.map(function(a){return a.length;});
        let longest = d3.max(lengths);
        if (longest > maxNumRace) { 
            maxNumRace = longest;
        }
    }

    let maxNumRating = 0
    for ( let i in histSumstatRating ){
        let allBins = histSumstatRating[i].value;
        let lengths = allBins.map(function(a){return a.length;});
        let longest = d3.max(lengths);
        if (longest > maxNumRating) { 
            maxNumRating = longest;
        }
    }

    let maxNumRaceRating = 0
    for ( let i in histSumstatRaceRating ){
        let allBins = histSumstatRaceRating[i].value;
        let lengths = allBins.map(function(a){return a.length;})
        let longest = d3.max(lengths)
        if (longest > maxNumRaceRating) { 
            maxNumRaceRating = longest;
        }
    }

    let yNum = d3.scaleLinear()
    .range([yScale.bandwidth() - 5, 0])
    .domain([-maxNum,maxNum])

    let yNumRace = d3.scaleLinear()
    .range([yScaleRace.bandwidth() - 5, 0])
    .domain([-maxNum,maxNum])

    let yNumRating = d3.scaleLinear()
    .range([yScale.bandwidth() - 5, 0])
    .domain([-maxNumRating,maxNumRating])

    let yNumRaceRating = d3.scaleLinear()
    .range([yScaleRace.bandwidth() - 5, 0])
    .domain([-maxNumRaceRating,maxNumRaceRating])


    let opacity = 0.8;



    let mouseout = function(e,d) {
      context.hoverTimer = null;
      d3.select('body').selectAll('div.nametooltip').remove();
    }
    let mouseoverMean = function(e,d) {
      context.hoverTimer = setTimeout(() => {
        let type = null;
        if(context.hoverTimer != null) {
          createInteraction(d3.select(this).attr('class'), InteractionTypes.HOVER,null,null);

          if(d3.select(this).attr('class') == "genderTimeMeanLine") {
            type = "time";
            
          }
          if(d3.select(this).attr('class') == "raceTimeMeanLine") {
            type = "time";
          }
          if(d3.select(this).attr('class') == "genderRatingMeanLine") {
            type = "rating";
          }
          if(d3.select(this).attr('class') == "raceRatingMeanLine") {
            type = "rating";

          }
    
          let toolTipDiv = d3.select('body').append('div').attr("class","nametooltip");
    
          toolTipDiv.style("opacity", 1)
                              .style("left", e.pageX - 10 + 'px')
                              .style("top", e.pageY + 15 + 'px');
              
          let tooltipText = "";
          if (type == "time") {
            tooltipText += "Average Time Spent: " + d[1].mean.toFixed(2);
          }
          if (type == "rating") {
            tooltipText += "Average Overall Rating: " + d[1].mean.toFixed(0);
          }          
          toolTipDiv.html(tooltipText);
          // udpdatePoints();
         
        }
    
      }, 100);


    }

    let tickWidth = 1.5;
    let tickHeight = 16;

    // mean lines
    plotGroupGender.selectAll("meanLines")
            .data(Array.from(sumstat))
            .enter()
            .append("line")  
            .attr("class", "genderTimeMeanLine")
            .attr("y1", function(d){return(yScale(d[0])+ bandWidth/2 + bandWidth/4)})
              .attr("y2", function(d){return(yScale(d[0]) + bandWidth/2 - bandWidth/4 )})
              .attr("x1", function(d){return (xScale(d[1]['mean']))})
              .attr("x2", function(d){return(xScale(d[1]['mean']))})
              .attr("stroke", "black")
              .attr('stroke-width', tickWidth)
              // .style("opacity", opacity)
              .style('cursor', 'pointer')
              .on('mouseover', mouseoverMean)
              .on('mouseout', mouseout)   
         

    plotGroupRace.selectAll("meanLines")
             .data(Array.from(sumstatRace))
             .enter()
             .append("line")  
             .attr("class", "raceTimeMeanLine")
             .attr("y1", function(d){return(yScaleRace(d[0]) + bandWidthRace/2 + bandWidthRace/4)})
                .attr("y2", function(d){return(yScaleRace(d[0]) + bandWidthRace/2 - bandWidthRace/4)})
                .attr("x1", function(d){return (xScale(d[1]['mean']))})
                .attr("x2", function(d){return(xScale(d[1]['mean']))})
                .attr("stroke", "black")
                // .style("opacity", opacity)
                .attr('stroke-width', tickWidth)
                .style('cursor', 'pointer')
                .on('mouseover', mouseoverMean)
                .on('mouseout', mouseout) 
              
    plotGroupGenderRating.selectAll("meanLines")
            .data(Array.from(sumstatRatingGender))
            .enter()
            .append("line")  
            .attr("class", "genderRatingMeanLine")
            .attr("y1", function(d){return(yScale(d[0])+ bandWidth/2 + bandWidth/4)})
              .attr("y2", function(d){return(yScale(d[0]) + bandWidth/2 - bandWidth/4)})
              .attr("x1", function(d){return (xScaleRating(d[1]['mean']))})
              .attr("x2", function(d){return(xScaleRating(d[1]['mean']))})
              .attr("stroke", "black")
              // .style("opacity", opacity)
              .attr('stroke-width', tickWidth)
              .style('cursor', 'pointer')
              .on('mouseover', mouseoverMean)
              .on('mouseout', mouseout) 

    plotGroupRaceRating.selectAll("meanLines")
            .data(Array.from(sumstatRatingRace))
            .enter()
            .append("line") 
            .attr("class", "raceRatingMeanLine")
            .attr("y1", function(d){return(yScaleRace(d[0])+ bandWidthRace/2 + bandWidthRace/4)})
              .attr("y2", function(d){return(yScaleRace(d[0]) + bandWidthRace/2 - bandWidthRace/4)})
              .attr("x1", function(d){return (xScaleRating(d[1]['mean']))})
              .attr("x2", function(d){return(xScaleRating(d[1]['mean']))})
              .attr("stroke", "black")
              // .style("opacity", opacity)
              .style('cursor', 'pointer')
              .attr('stroke-width', tickWidth)
              .on('mouseover', mouseoverMean)
              .on('mouseout', mouseout) 

    let createInteraction = function(element, type, recommendation, focusTime) {
      let interaction = context.initializeNewInteraction();
      interaction.element=element;
      interaction.interactionType=type;
      interaction.recommendation=recommendation;
      interaction.focusTime = focusTime;
      context.addInteraction(interaction);
    }

    let onclick = function(e,d) {
      createInteraction(d3.select(this).attr('class'), InteractionTypes.CLICK,d.recommendation,d.focusTime);

      this.selectedObject = d;
      this.currentId = d.applicant_id;

      d3.select('body').selectAll('div.nametooltip').remove();
      
      context.router.navigate(['/rating/', d.applicant_id]);
    }
    
    let activeColor = "#0D6EFD";
    let udpdatePoints = function() {
       d3.selectAll('.genderTimePoints')
       .style('stroke-width', (d) => {
            var width = (d['applicant_id'] == context.selectedObject['applicant_id'] ? '4px': '2px'); 
            return width;
        })
        .style('stroke', (d) => {
            var color = (d['applicant_id'] == context.selectedObject['applicant_id'] ? activeColor: genderColorScale(d['GENDER'])); 
            return color;
        });
        d3.selectAll('.raceTimePoints')
        .style('stroke-width', (d) => {
            var width = (d['applicant_id'] == context.selectedObject['applicant_id'] ? '4px': '2px'); 
            return width;
        })
        .style('stroke', (d) => {
            var color = (d['applicant_id'] == context.selectedObject['applicant_id'] ? activeColor:raceColorScale(d['RACE'])); 
            return color;
        });

        d3.selectAll('.genderRatingPoints')
        .style('stroke-width', (d) => {
            var width = (d['applicant_id'] == context.selectedObject['applicant_id'] ? '4px': '2px'); 
            return width;
        })
        .style('stroke', (d) => {
            var color = (d['applicant_id'] == context.selectedObject['applicant_id'] ? activeColor: genderColorScale(d['GENDER'])); 
            return color;
        });
    
        d3.selectAll('.raceRatingPoints')
        .style('stroke-width', (d) => {
            var width = (d['applicant_id'] == context.selectedObject['applicant_id'] ? '4px': '2px'); 
            return width;
        })
        .style('stroke', (d) => {
            var color = (d['applicant_id'] == context.selectedObject['applicant_id'] ? '#3182bd': raceColorScale(d['RACE'])); 
            return color;
        });
    }

      
    let mouseover = function(e,d) {
      context.hoverTimer = setTimeout(() => {
        let type = null;
        if(context.hoverTimer != null) {

          if(d3.select(this).attr('class') == "genderTimePoints") {
            type = "time";
            createInteraction(InteractionElements.TIME_GENDER, InteractionTypes.HOVER,d.recommendation,d.focusTime);
          }
          if(d3.select(this).attr('class') == "raceTimePoints") {
            type = "time";
            createInteraction(InteractionElements.TIME_RACE, InteractionTypes.HOVER,d.recommendation,d.focusTime);
          }
          if(d3.select(this).attr('class') == "genderRatingPoints") {
            type = "rating";
            createInteraction(InteractionElements.RATING_GENDER, InteractionTypes.HOVER,d.recommendation,d.focusTime);
          }
          if(d3.select(this).attr('class') == "raceRatingPoints") {
            type = "rating";
            createInteraction(InteractionElements.RATING_RACE, InteractionTypes.HOVER,d.recommendation,d.focusTime);
          }
          context.selectedObject = context.reviewedApplicants[d.applicant_id];
          context.currentId = d.applicant_id;
          context.comments=[];
          context.getComments();
    
          let toolTipDiv = d3.select('body').append('div').attr("class","nametooltip");
    
          toolTipDiv.style("opacity", 1)
                              .style("left", e.pageX - 10 + 'px')
                              .style("top", e.pageY + 15 + 'px');
              
          let tooltipText = d.NAME_FIRST + " " + d.NAME_LAST;
          if (type == "time") {
            tooltipText += "<br>Time Spent: " + d.focusTime.toFixed(2);
          }
          if (type == "rating") {
            tooltipText += "<br>Overall Rating: " + d.recommendation;
          }          
          toolTipDiv.html(tooltipText);
          udpdatePoints();
         
        }
    
      }, 100);


    }


    // let jitterWidth = 30;
    plotGroupGender.selectAll("indPoints")
             .data(data)
             .enter()
             .append("circle")
              .attr("class", "genderTimePoints")
              .attr("cx", function(d){ return(xScale(d['focusTime']))})
              .attr("cy", function(d){ return( yScale(d['GENDER']) + (bandWidth/4 + bandWidth/4))})
              .attr("r", 4)
              .style("fill", "white")
              .style("fill-opacity", 0.6)
              .attr("stroke", "black")
              .style('stroke-width', '1px')
              .style('cursor', 'pointer')
              .on('click', onclick) 
              .on('mouseover', mouseover)
              .on('mouseout', mouseout)   
              .style("opacity", opacity);   



    plotGroupRace.selectAll("indPoints")
             .data(data)
             .enter()
             .append("circle")
              .attr("class", "raceTimePoints")
              .attr("cx", function(d){ return(xScaleRace(d['focusTime']))})
              .attr("cy", function(d){ return( yScaleRace(d['RACE'])+ (bandWidthRace/4 + bandWidthRace/4))})
              // .attr("cx", function(d){ return( xScale(d['GENDER']) + (bandWidth/2) - jitterWidth/2 + Math.random()*jitterWidth )})
              .attr("r", 4)
              .style("fill", "white")
              .style("fill-opacity", 0.6)
              .attr("stroke", "black")
              .style('stroke-width', '1px')
              .style('cursor', 'pointer')
              .on('click', onclick) 
              .on('mouseover', mouseover)
              .on('mouseout', mouseout)
              .style("opacity", opacity);    

    plotGroupGenderRating.selectAll("indPoints")
             .data(data)
             .enter()
             .append("circle")
              .attr("class", "genderRatingPoints")
              .attr("cx", function(d){ return(xScaleRating(d['recommendation']))})
              .attr("cy", function(d){ return( yScale(d['GENDER']) + (bandWidth/4 + bandWidth/4))})
              .attr("r", 4)
              .style("fill", "white")
              .style("fill-opacity", 0.6)
              .attr("stroke", "black")
              .style('stroke-width', '1px')
              .style('cursor', 'pointer')
              .on('click', onclick) 
              .on('mouseover', mouseover)
              .on('mouseout', mouseout)   
              .style("opacity", opacity);   


    plotGroupRaceRating.selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
     .attr("class", "raceRatingPoints")
     .attr("cx", function(d){ return(xScaleRating(d['recommendation']))})
     .attr("cy", function(d){ return( yScaleRace(d['RACE'])+ (bandWidthRace/4 + bandWidthRace/4))})
     // .attr("cx", function(d){ return( xScale(d['GENDER']) + (bandWidth/2) - jitterWidth/2 + Math.random()*jitterWidth )})
     .attr("r", 4)
     .style("fill", "white")
     .style("fill-opacity", 0.6)
     .attr("stroke", "black")
     .style('stroke-width', '1px')
     .style('cursor', 'pointer')
     .on('click', onclick) 
     .on('mouseover', mouseover)
     .on('mouseout', mouseout)
     .style("opacity", opacity);  
      

     udpdatePoints()
    // this.updateBarChart();
  }

  // draw density plot for the ratings,
  ratingDensityPlot() {
    // prepare data
    let data = Object.values(this.reviewedApplicants);
    let context = this;

    const container = '#rating-distribution';
    $(container).empty();
    let plotMargins = {top: 0, right: 8, bottom: 0, left: 8};
    const width = $(container).width();
    const height = 20;

    let svg = d3.selectAll(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    let xScale = d3.scaleLinear()
    .range([0, width - plotMargins.left - plotMargins.right])
    .domain([1, 100]); 
    
    let numBins =5;
    let histogram = d3.bin()
        .domain([1, 100])
        .thresholds(xScale.ticks(numBins))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)


    let input = data.map(d => d['recommendation']); 
    let bins = histogram(input); 
    let lengths = bins.map(function(a){return a.length;})
    let longest = d3.max(lengths)
    let yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, longest])

    svg.append('g')
        .attr('transform', `translate(${plotMargins.left},${plotMargins.top })`)
        .selectAll("violin")
        .data([bins])
        .enter()   
        .append("path")      
            .attr("d", <any>d3.area()
                .y1( yScale(0) )
                .y0(function(d){return(yScale(d['length'])) } )
                .x(function(d){return(xScale(d['x0'])) } )
                .curve(d3.curveCatmullRom))
            .style("fill", "orange")
            // .style("stroke", "orange")
            .style("opacity", 0.5)
  }
  
  getSumStatData(groupBy, value) {
    let data = Object.values(this.reviewedApplicants);
    let keyFn = d => d[groupBy];
    let valueFn = d => d[value];

    const summaryReducer = function(values) {  
      let q1 = d3.quantile(values, 0.25, valueFn); 
      let median = d3.median(values, valueFn)
      let mean = d3.mean(values, valueFn)
      let q3 = d3.quantile(values, 0.75, valueFn);
      let interQuantileRange = q3 - q1;

      let min = Math.max(q1 - 1.5 * interQuantileRange, Number(d3.min(values, valueFn)));
      let max = Math.min(q3 + 1.5 * interQuantileRange, Number(d3.max(values, valueFn)));

      return {
        q1: q1, 
        median: median, 
        q3: q3, 
        interQuantileRange: interQuantileRange,
         min: min, 
         max: max,
         mean: mean
      }
    }  

    return d3.rollup(data, summaryReducer, keyFn);
  }

  wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

  getUserVisSetting() {
    this.userService.getUserVisSetting().subscribe(
      data => {
        data = data[0];
        this.dataConfig.xVar = data.xVar;
        this.dataConfig.yVar = data.yVar;
        this.dataConfig.colorEncoding = data.color_encoding;
        this.dataConfig.showFocusTime = data.focustime;
      
      },
      err => {
        
      });

  }

  updateVisSetting(value) {
    this.userService.updateUserVisSetting(value).subscribe(
      data => {
    
      },
      err => {
        
      });

  }

  openDialog() {
    const el: HTMLDialogElement = this.plotDialogElement.nativeElement;
    el.showModal();

  }
  onCloseDialog(){
    const el: HTMLDialogElement = this.plotDialogElement.nativeElement;
    el.close();
  }

  updateVisitStatus() {
    this.userService.updateUserVisitStatus().subscribe(
      data => {
       
      },
      err => {
        
      });
  }

  startTour() {
    let stepMapping = {
      'step10': 'tour_mySummary_tab',
      'step11': InteractionElements.TOUR_TIME_PLOT,
      'step12': InteractionElements.TOUR_RATING_PLOT,
      'step13': InteractionElements.TOUR_TIME_GENDER_PLOT,
      'step14': InteractionElements.TOUR_APPLICANT_LIST,
      'step15': 'tour_profile',
      'step16': 'tour_last_step',

    }

    this.joyrideService.startTour(
      { 
        customTexts: {
          // next: '>>',
          // prev: '<<',
          done: 'Get Started'
        },
       steps: ['step10', 'step11', 'step12',
      'step13', 'step14', 'step15', 'step16']
    } 
    ).subscribe(
      step => { 
        // console.log("step: ", step);
        let interaction = this.initializeNewInteraction();
        interaction.interactionType = "tour";
        interaction.element =stepMapping[step.name];
        interaction.focusTime = null;
        // console.log("interaction: ", interaction);
        this.addInteraction(interaction);
      },
      error => {
      },
      () => {
        let interaction = this.initializeNewInteraction();
        interaction.interactionType = "tourFinished";
        interaction.focusTime = null;
        // console.log("interaction: ", interaction);
        this.addInteraction(interaction);
        
        this.tourStatusService.setSummaryVariable(true);
        this.updateTourStatus();
       
        
      }
    )

  }
  onClickName(data) {
    this.selectedObject = this.reviewedApplicants[data.id];
    this.currentId = data.id;
    let interaction = this.initializeNewInteraction();
    interaction.element='applicantList';
    interaction.interactionType=InteractionTypes.CLICK;
    interaction.recommendation=this.selectedObject['recommendation'];
    interaction.focusTime = this.selectedObject['focusTime'];
    this.addInteraction(interaction);
    this.router.navigate(['/rating/', data.id]);

  }
  onHoverName(data) {
    this.hoverTimer = setTimeout(() => {
        if(this.hoverTimer != null) {
            this.selectedObject = this.reviewedApplicants[data.id];
            this.currentId = data.id;
            this.initBoxplots();
            //TODO: add interaction
            let interaction = this.initializeNewInteraction();
            interaction.element='applicantList';
            interaction.interactionType=InteractionTypes.HOVER;
            interaction.recommendation=this.selectedObject['recommendation'];
            interaction.focusTime = this.selectedObject['focusTime'];
            this.addInteraction(interaction);
        }
    }, 300);
  }
  onMouseoutName() {
    this.hoverTimer = null;
  }


  updateTourStatus(): void {
    this.userService.updateSummaryTourStatus().subscribe(
      data => {
       
      },
      err => {
        
      });
  }
}










