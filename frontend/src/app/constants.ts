import * as d3 from 'd3';

export const enum InteractionTypes {
    // individual view interaction types
    CLICK = "click",
    MOUSEENTER = "mouseenter",
    SCROLL = "scroll",
    CHANGE_PDF_PAGE = "change_PDF_page",
    ADD_PROFILE_ATTRIBUTES = "add_attr",
    REMOVE_PROFILE_ATTRIBUTES = "remove_attr",
    
    // CANCLE = "cancle",
    // SUBMIT= "submit_comment",
    // DELETE_COMMENT = "delete_comment",
    // UPDATE_RATING = "update_rating",
    // LOGIN = "login",
    LOGOUT = "logout",
    // CHANGE_PW = "change_pw",
    VISIBLE="visible",
    HIDDEN="hidden",
    ENTER="enter",  
    LEAVE="leave",   
    CLOSE="close",  // close the window

    // summary view interaction types
    HOVER="hover"
}

export const enum InteractionElements {
    // individual view interaction elements
    NAVBAR = "navbar",
    PROGRESS ="progress",
    PDFTEXT = "PDF",
    PDFTAB = "PDFTab",
    COMMENT = "comment",
    PROFILE = "profile",
    RATING = "rating",
    WINDOW="window",
    INDIVIDUAL_VIEW="individual_view",
    RECO="recommendation",

    // summary view interaction elements
    SUMMARY_VIEW="summary_view",
    CIRCLE="circle",
    RECOMMENDATION="recommendation",
    // BOXPLOT_GENDER="boxplot_gender",
    // BOXPLOT_RACE="boxplot_race",
    // BOXPLOT_RATE="boxplot_rate",

    TIME_GENDER="time_gender",
    TIME_RACE="time_race",
    RATING_GENDER="rating_gender",
    RATING_RACE="rating_race",

    TOUR_TIME_PLOT="tour_time_plot",
    TOUR_RATING_PLOT="tour_rating_plot",
    TOUR_TIME_GENDER_PLOT="tour_time_gender_plot",
    TOUR_APPLICANT_LIST="tour_applicant_list",
    


}


// export const ENCODING_COLOR = {
//     "female":"#eb4729",
//     "male": "#1b909A",
//     "competitive": "#1a9641",
//     "somewhat_competitive": "#a6d96a",
// }



  // rateDomain = ['Competitive', 'Unsure', 'Uncompetitive'];
  // genderDomain = ['F', 'M'];
  // raceDomain = ['Asian', 'Black', 'White'];

export const ColorDomains = {
    DECISION:['Admitted', 'Waitlisted', 'Rejected', 'Undecided'],
    RECOMMENDATION: ['4', '3', '2', '1'],
    GENDER: ['F', 'M', 'Unknown'],
    RACE: ['ASIAN', 'BLACK', 'HISPA',  'WHITE', 'MULTI', 'UNKNOWN']
}

export const ColorRanges = {
    DECISION:[ "#1a9641", "#ffd301", "#d7191c", "#bababa"],
    RECOMMENDATION: [ "#1a9641", "#a6d96a", "#fdae61", "#d7191c"],
    GENDER:["#eb4729", "#1b909A", "#bababa"], 
    RACE:  d3.schemeCategory10 ,
}

export const LegendLabels = {
    DECISION: ['Admitted', 'Waitlisted', 'Rejected', 'Undecided'],
    RECOMMENDATION: ['Very Highly Competitive', 'Highly Competitive', 'Competitive', 'Not Competitive'],
    GENDER:['Female', 'Male', 'Unknown'],
    RACE: ['Asian', 'Black/African American ', 'Hispanic', 'White', 'Multi', 'Unspecified']
}



export const NAVAL = {
    GRE: 280,
    GPA: 0,
    RATING: -1
}

export const DECISION = {
    ADMIT: "Admitted",
    WAITLIST: "Waitlisted",
    REJECT: "Rejected",
    UNDECIDED: "Undecided"
}

export const INTERVIEWERCOLOR = "#B3CBFD";
export const INTERVIEWPLOTCOLOR = "#6897FC";