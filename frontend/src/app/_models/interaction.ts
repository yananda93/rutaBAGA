export class Interaction {
    userId: number;
    applicantId: number;
    pdfType: string;
    interactionType: string;
    element: string;
    applicationGroup: string;
    timeStamp: number;
}


export class VISInteraction {
    userId: number;
    applicantId: number;
    interactionType: string;
    element: string;
    recommendation: number;
    xVar: string;
    yVar: string;
    timeEncoding:number;
    colorEncoding: string;
    timeStamp: number;
    focusTime:number;
    plotType:string;
}
  
  
  
  