import { Injectable } from '@angular/core';
import { NAVAL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  
  formatAttribute(attr, context) {
    
    var placeHolder = '--';
   
    if(Object.keys(context.selectedObject).length > 0) {
      if(attr == "Name") {
        return context.selectedObject[context.dataConfig.profileAttributeMapping['First Name']] + ' ' 
               + context.selectedObject[context.dataConfig.profileAttributeMapping['Last Name']]
      }
      else if(attr == "SAT Score") {
        var rw = ' ( Reading & Writing: ' + context.selectedObject['SAT_RW'] +', ';
        var math = 'Math: ' + context.selectedObject['SAT_MATH'] + ')';
          
        return context.selectedObject[context.dataConfig.profileAttributeMapping[attr]] + rw + math;
      }
      else if(attr == "Class Rank") {
          var s = "";
          s += context.selectedObject[context.dataConfig.profileAttributeMapping['Class Rank']];
          s += " / " + context.selectedObject['CLASS_SIZE'];
         return s;

      }
      else { 
            return context.selectedObject[context.dataConfig.profileAttributeMapping[attr]];     
        }
      }
  }

  normalizeGPA(gpa, scale) {
    if(gpa && scale) {
      let num =  4*(gpa/scale);
      return parseFloat(num.toFixed(2));
    }
    else
      return NAVAL.GPA;
  }

  formatComment(content) {
    return content.replaceAll('\n', '<br>');
  }


}
