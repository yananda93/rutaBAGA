import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const USERAPP_API = environment.apiUrl + '/userapplications';

@Injectable({
  providedIn: 'root'
})
export class InteractionLogService {

  constructor() { }
}
