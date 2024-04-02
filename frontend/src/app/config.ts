export class ScatterPlotConfig {
  xScale: Function;
  xAxis: Function;
  xAxisGroup: Function;
  pointsGroup: Function;
  yScale: Function;
  yAxis: Function;
  yAxisGroup: Function;
  rateColorScale: Function;
  genderColorScale: Function;
  raceColorScale: Function;
  decisionColorScale:Function;

  sizeScale: Function;
  width: number;
  height: number;
}


export class StripPlotConfig {
  xScale: Function;
  xAxis: Function;
  xAxisGroup: Function;
  pointsGroup: Function;
  yScale: Function;
  yAxis: Function;
  yAxisGroup: Function;
  colorScale: Function;
}



export var DataConfig = {
    dataset: [],
    datasetDict: {},
    mergedDatasetDict: {},

    // xVar: "NORMALIZED_GPA",
    // yVar: "program_fit",
    xVar:null,
    yVar:null,
    xVarGroup:null,
    yVarGroup:null,
    selectedObject: {},
    currentId:0,
    numDecided:0,
    numericalVariables:['GPA','CLASS_RANK', 'SAT',  "SAT_MATH",  "SAT_RW" , "academic", "activities", "communication", "LOR Strength", "recommendation"], 

    categoricalVariables:['Rate'],
    ratingVariables:['Academic', 'Activities', 'LOR Strength', 'Communication'],
    ratingVariablesMap:{
      'Academic': 'academic',
      'Activities': 'activities', 
      'Communication': 'communication', 
      'LOR Strength': 'LOR_strength',
      'Overall Rating': 'recommendation'
    },

    ratingVariablesTooltip:{
      "Academic": "Overall academic achievements including grades, transcripts, standardized test scores, etc.",
      "Activities": "Involvement in extracurricular activities, community service, sports, clubs, leadership roles, etc.", 
      "LOR Strength": "Strength of the letter of recommendations.", 
      "Communication": "Ability to communicate clearly in English, verbally and written.",
      "Overall Rating": "Overall competitiveness of this applicant"
    },

    profileAttributeListAll:[
      'Name', 'High School Code','GPA', 'Class Rank', 'SAT Score', 'Gender', 'Race'
    ],


    profileAttributeMapping:{

      "First Name": "NAME_FIRST",
      "Last Name": "NAME_LAST",
      "High School Code": "SCHOOL_CODE",
      "GPA": "GPA",
      "SAT Score": "SAT",
      "Class Rank" : "CLASS_RANK",
      "Gender": "GENDER",
      "Race" : "RACE"
    },

    profileAttributesSelectDropdownSettings: { 
      singleSelection: false, 
      text:"Select Attributes",
      badgeShowLimit: 2,
    },

    showFocusTime:false,
    colorEncoding:'gender',
    showFocusTimeGroup:false,
    colorEncodingGroup:'gender',
    groupAbled:'false',

    filterObj: {},
    activeFilters: {},
    groupActiveFilters: {},
    groupFilterObj: {},
   
    defaultFilterObj: {
      Categorical:{
        recommendation: {"types": ["All", 1, 2, 3, 4],"model": "All"},
        GENDER: {"types": ["All", "F", "M"],"model": "All"},
        // RACE: {"types": ["All", 'ASIAN', 'BLACK', 'HISPA',  'WHITE', 'OTHER'],"model": "All"},
        RACE: {"types": ["All", 'ASIAN', 'BLACK', 'WHITE'],"model": "All"},
      },
  
      Numerical:{
        'GRE':{"max":340, "step": 1,"min":340,"model": [0,340]},
        'NORMALIZED_GPA':{"max":4, "step": 0.1,"min":4,"model": [0,4]},
        'NORMALIZED_GPA_GRAD':{"max":4, "step": 0.1,"min":4,"model": [0,4]},
        'teaching':{"max":5, "step": 1,"min":0,"model": [0,5]},
        'academic':{"max":5, "step": 1,"min":0,"model": [0,5]},
        'research':{"max":5, "step": 1,"min":0,"model": [0,5]},
        'communication':{"max":5, "step": 1,"min":0,"model": [0,5]},
      }
    },


    variableMapping:{
        "GENDER" : "Gender",
        "RACE" : "Race",
        "GRE" : "GRE Score",
        "NORMALIZED_GPA" : "Normalized GPA(Undergrad)",
        'NORMALIZED_GPA_GRAD':"Normalized GPA(Grad)",
        "teaching": "Teaching Preparedness",
        "academic": "Academic Preparedness",
        "research": "Research Preparedness",
        "communication": "Communication Proficiency",
        "recommendation": "Overall Recommendation",  
       
  },   
    // ['Very Highly Competitive', 'Highly Competitive', 'Competitive', 'Not Competitive'],
    categoricalFilterMapping:{
      recommendation:{
        "All":"All",
        "1": "Not Competitive",
        "2": "Competitive",
        "3": "Highly Competitive",
        "4": "Very Highly Competitive"
      }

    },

      fileNameMapping: {

        "LOR1": "LOR_1",
        "LOR2": "LOR_2",
      },


      sortByVariables: [
        {
          "datatype": "string",
          "name": "last_name",
          "order": 0  // asc
        },
        {
          "datatype": "number",
          "name": "num_reviewers",
          "order": 1  // desc
        },
        {
          "datatype": "number",
          "name": "recommendation",
          "order": 1  // desc
        }
      ],

      sortByVariablesMapping: {
        'last_name': 'Last Name',
        'num_reviewers': '# of Reviewers' ,
        'recommendation': 'Avg Reco.'

      },
      sortLevels: [],
      sortDefaultVar: {
        "datatype": "string",
        "name": "last_name",
        "order": 0
      },

      activePlot:"boxplot",
      groupActivePlot:"boxplot",
    }
  
  
  