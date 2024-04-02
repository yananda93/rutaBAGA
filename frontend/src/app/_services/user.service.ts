import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import  { UserInfo, UserStatus }  from '../_models/user'

const USERAPP_API = environment.apiUrl + '/userapplications';

const USERSTATUS_API = environment.apiUrl + '/userstatus';

const USERINFO_API = environment.apiUrl + '/userinfo';
const USERSETTING_API = environment.apiUrl + '/getusersetting';
const SETUSERSETTING_API = environment.apiUrl + '/setusersetting';

const USERVISSETTING_API = environment.apiUrl + '/getuservissetting';
const UPDATEUSERVISSETTING_API = environment.apiUrl + '/updateuservissetting';

const USERCOMMENTS_API = environment.apiUrl + '/comments/';
const ALLCOMMENTS_API = environment.apiUrl + '/allcomments/';
const GROUPCOMMENTS_API = environment.apiUrl + '/groupcomments/';
const INTERVIEWCOMMENTS_API = environment.apiUrl + '/interviewcomments/';

const RATINGS_API = environment.apiUrl + '/ratings/';

const ADDCOMMENT_API = environment.apiUrl + '/addcomment';
const REMOVECOMMENT_API = environment.apiUrl + '/removecomment';

const ADDINTERVIEWCOMMENT_API = environment.apiUrl + '/addinterviewcomment';
const REMOVEINTERVIEWCOMMENT_API = environment.apiUrl + '/removeinterviewcomment';

const ADDGROUPCOMMENT_API = environment.apiUrl + '/addgroupcomment';
const REMOVEGROUPCOMMENT_API = environment.apiUrl + '/removegroupcomment';


const UPDATERATING_API = environment.apiUrl + '/updaterating/';
const UPDATEUSERREVIEWED_API = environment.apiUrl + '/updatereviewed/';
const UPDATEUSERSETTING_API = environment.apiUrl + '/updateusersetting';

const UPDATEUSERSTATUS_API = environment.apiUrl + '/updateuserstatus';
const ADDINTERACTION_API = environment.apiUrl + '/addinteraction';
const ADDVISINTERACTION_API = environment.apiUrl + '/addvisinteraction';

const USERRATING_API = environment.apiUrl + '/userrated';
const USERFOCUSTIME_API = environment.apiUrl + '/focustime';
const ALLFOCUSTIME_API = environment.apiUrl + '/allfocustime';

const USERSTATS_API = environment.apiUrl + '/userstats';
const INTERVIEWERSTATS_API = environment.apiUrl + '/interviewerstats';

const DELETEUSERRATING_API = environment.apiUrl + '/deleterating/';

const USERINTERVIEWAPP_API = environment.apiUrl +'/userinterviewapplications';

const UPDATEUSERRATINGSETTING_API = environment.apiUrl + '/updateuserratingsetting';

const INTERVIEWRATINGS_API = environment.apiUrl + '/interviewratings/';

const UPDATEINTERVIEWRATING_API = environment.apiUrl + '/updateinterviewrating/';

const UPDATEUSERINTERVIEWED_API = environment.apiUrl + '/updateinterviewed/';

const DELETEUSERINTERVIEWRATING_API = environment.apiUrl + '/deleteinterviewrating/';

const UPDATEUSERVISITSTATUS_API = environment.apiUrl + '/updateuservisitstatus';

const GETAVGTIMERACE_API = environment.apiUrl + '/gettimebyrace';

const GETAVGTIMERATE_API = environment.apiUrl + '/gettimebyrate';

const GETAVGTIMEGENDER_API = environment.apiUrl + '/gettimebygender';

const UPDATETOURSTATUS_API = environment.apiUrl + '/updatetourstatus';

const UPDATEFINISH_API = environment.apiUrl + '/updatefinished';

const UPDATESUMMARYTOURSTATUS_API = environment.apiUrl + '/updatesummarytourstatus';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserInfo(): Observable<any> {
    return this.http.get<UserInfo>(USERINFO_API);
  }

  getUserStatus(): Observable<any> {
    
    return this.http.get<UserStatus>(USERSTATUS_API);
  }

  getUserStats(): Observable<any> {
    
    return this.http.get(USERSTATS_API);
  }
  getInterviewerStats(): Observable<any> {
    
    return this.http.get(INTERVIEWERSTATS_API);
  }

  getAssignedApplications(): Observable<any> {

    return this.http.get(USERAPP_API);
  }

  getUserSetting(): Observable<any> {
    return this.http.get(USERSETTING_API);
  }

  setUserSetting(setting): Observable<any> {
    return this.http.put(SETUSERSETTING_API, setting);
  }
  
  getUserVisSetting(): Observable<any> {
    return this.http.get(USERVISSETTING_API);
  }

  updateUserVisSetting(setting): Observable<any> {
    return this.http.put(UPDATEUSERVISSETTING_API, setting);
  }

  getComments(id): Observable<any> {
    return this.http.get(USERCOMMENTS_API + id);
  }

  getAllComments(id): Observable<any> {
    return this.http.get(ALLCOMMENTS_API + id);
  }
  

  getGroupComments(id): Observable<any> {
    return this.http.get(GROUPCOMMENTS_API + id);
  }

  getInterviewComments(id): Observable<any> {
    return this.http.get(INTERVIEWCOMMENTS_API + id);
  }

  getRatings(id): Observable<any> {
    return this.http.get(RATINGS_API + id);
  }

  getInterviewRatings(id): Observable<any> {
    return this.http.get(INTERVIEWRATINGS_API + id);
  }

  addComment(comment): Observable<any> {
      return this.http.post(ADDCOMMENT_API, comment);
  }

  removeComment(content, applicant_id): Observable<any> {
    return this.http.put(REMOVECOMMENT_API, {content, applicant_id});
  }

  addInterviewComment(comment): Observable<any> {
    return this.http.post(ADDINTERVIEWCOMMENT_API, comment);
  } 

  removeInterviewComment(content, applicant_id): Observable<any> {
    return this.http.put(REMOVEINTERVIEWCOMMENT_API, {content, applicant_id});
  }


  addGroupComment(comment): Observable<any> {
    return this.http.post(ADDGROUPCOMMENT_API, comment);
}

  removeGroupComment(content, applicant_id): Observable<any> {
    return this.http.put(REMOVEGROUPCOMMENT_API, {content, applicant_id});
  }

  updateRating(field, rating): Observable<any> {
    return this.http.post(UPDATERATING_API + field, rating);
  }

  updateInterviewRating(field, rating): Observable<any> {
    return this.http.post(UPDATEINTERVIEWRATING_API + field, rating);
  }


  updateUserReviewed(id, reviewed): Observable<any> {
    return this.http.put(UPDATEUSERREVIEWED_API + id, {"reviewed": reviewed});
  }

  updateUserInterviewed(id, reviewed): Observable<any> {
    return this.http.put(UPDATEUSERINTERVIEWED_API + id, {"reviewed": reviewed});
  }

  updateUserSetting(usersetting): Observable<any> {
    return this.http.put(UPDATEUSERSETTING_API, usersetting);
  }

  updateUserStatus(current_id): Observable<any> {
    return this.http.put(UPDATEUSERSTATUS_API, {current_id});
  }

  addInteraction(interaction):Observable<any> {
    // console.log(interaction)
    return this.http.post(ADDINTERACTION_API, interaction);
  }

  addVISInteraction(interaction):Observable<any> {
    // console.log(interaction)
    return this.http.post(ADDVISINTERACTION_API, interaction);
  }

  getReviewedApplicants(): Observable<any> {
    return this.http.get(USERRATING_API);
  }

  getFocusTime(): Observable<any> {
    return this.http.get(USERFOCUSTIME_API);
  }

  getAllFocusTime(): Observable<any> {
    return this.http.get(ALLFOCUSTIME_API);
  }

  deleteRating(id): Observable<any> {
    return this.http.delete(DELETEUSERRATING_API + id, {});
  }

  deleteInterviewRating(id): Observable<any> {
    return this.http.delete(DELETEUSERINTERVIEWRATING_API + id, {});
  }

  getInterviewApplications() : Observable<any> {
    return this.http.get(USERINTERVIEWAPP_API);
  }

  updateUserRatingTabSetting(activeTab): Observable<any>{
    return this.http.put(UPDATEUSERRATINGSETTING_API, {"activeTab":activeTab});
  }
  updateUserVisitStatus(): Observable<any>{
    return this.http.put(UPDATEUSERVISITSTATUS_API,{});
  }

  getAvgTimeRace(): Observable<any>{
    return this.http.get(GETAVGTIMERACE_API);
  }

  getAvgTimeRate(): Observable<any>{
    return this.http.get(GETAVGTIMERATE_API);
  }


  getAvgTimeGender(): Observable<any>{
    return this.http.get(GETAVGTIMEGENDER_API);
  }

  updateTourStatus(): Observable<any> {
    return this.http.put(UPDATETOURSTATUS_API,{});
  }
  updateFinished(): Observable<any> {
    return this.http.put(UPDATEFINISH_API,{});
  }

  updateSummaryTourStatus(): Observable<any> {
    return this.http.put(UPDATESUMMARYTOURSTATUS_API,{});
  }
}