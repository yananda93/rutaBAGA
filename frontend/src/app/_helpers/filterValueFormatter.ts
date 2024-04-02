import { NouiFormatter } from "ng2-nouislider";
import { NAVAL } from '../constants'

export class RatingFormatter implements NouiFormatter {

    to(value: number): string {
      if(value == NAVAL.RATING)
        return "N/A"
      let res = value.toString().split('.')[0];
      return res;
   }
  
    from(value: string): number {
      return Number(value);
    }
  }
  
  export class GREFormatter implements NouiFormatter {
  
    to(value: number): string {
      if(value == NAVAL.GRE)
        return "N/A"
      let res = value.toString().split('.')[0];
      return res;
   }
  
    from(value: string): number {
      return Number(value);
    }
  }
  
  export class GPAFormatter implements NouiFormatter {
  
    to(value: number): string {
      if(value == NAVAL.GPA)
        return "N/A"
      let res = value.toFixed(2);
      return res;
   }
  
    from(value: string): number {
      return Number(value);
    }
  }

  export class intFormatter implements NouiFormatter {
  
    to(value: number): string {
     
      let res = value.toFixed(0);
      return res;
   }
  
    from(value: string): number {
      return Number(value);
    }
  }