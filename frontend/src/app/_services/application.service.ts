import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const APPALL_API = environment.apiUrl + '/getapplications';
const APPNUM_API = environment.apiUrl + '/getnumapplications';
const APP_API = environment.apiUrl + '/applications/';
const APPDOC_API = environment.apiUrl + '/applicantdoc/';
const PDF_API = environment.apiUrl + '/pdffile/';
const APPRATEDALL_API = environment.apiUrl + '/getallrated';
const APPINTERVIEWEDALL_API = environment.apiUrl + '/getallinterviewed';

const APP_DECISION = environment.apiUrl + '/updatedecision';
const APP_DECISIONRANK = environment.apiUrl + '/updatedecisionrank';

const REVIEWSTATUS_API = environment.apiUrl + '/getreviewstatus';
const ALLREVIEW_API = environment.apiUrl + '/getallreviews';

const INTERVIEWSTATUS_API = environment.apiUrl + '/getinterviewstatus';
const ALLINTERVIEWREVIEW_API = environment.apiUrl + '/getallinterviewreviews';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  selectApplicant = {};

  constructor(private http: HttpClient) { }

  getSelectedApplicant() {
    return this.selectApplicant;
  }

  setSelectedApplicant(applicant) {
    this.selectApplicant = applicant;
  }

  getApplications():Observable<any> {
    const url = APPALL_API;
    return this.http.get(url);

  }
  getApplicationCount():Observable<any> {
    const url = APPNUM_API;
    return this.http.get(url);

  }

  getApplication(id):Observable<any> {
    const url = APP_API + id;
    return this.http.get(url);

  }

  getApplicantFile(id):Observable<any> {
    const url = APPDOC_API + id;
    return this.http.get(url);
  }

  getPDF(docTpye, id):Observable<Blob> {
    const url = PDF_API + id + "/" + docTpye;
    return this.http.get(url, {responseType: 'blob'});

  }

  getAllApplication():Observable<any> {
    return this.http.get(APPRATEDALL_API);
  }
  getInterviewRatings():Observable<any> {
    return this.http.get(APPINTERVIEWEDALL_API);
  }

  updateDecision(id, decision):Observable<any> {
    return this.http.put(APP_DECISION, {'XACT_ID':id, 'decision': decision});
  }

  updateDecisionRank(id, rank):Observable<any> {
    return this.http.put(APP_DECISIONRANK, {'XACT_ID':id, 'rank': rank});
  }

  enableGroupView() {
    // UPDATE LATER
    // if(window.sessionStorage.getItem("isAdmin") == "1") {
    //   return true;
    // }
    // return false;
    return true;
  }

  enableInterviewView() {
    // if(window.sessionStorage.getItem("isAdmin") == "1") {
    //   return true;
    // }
    return false;
  }

  getReviewStatus():Observable<any> {
    return this.http.get(REVIEWSTATUS_API);
  }

  getAllReviews():Observable<any> {
    return this.http.get(ALLREVIEW_API);
  }

  getInterviewStatus():Observable<any> {
    return this.http.get(INTERVIEWSTATUS_API);
  }

  getAllInterviewReviews():Observable<any> {
    return this.http.get(ALLINTERVIEWREVIEW_API);
  }
}

