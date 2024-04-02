import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule }  from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndividualViewComponent } from './individual-view/individual-view.component';
// import { GroupViewComponent } from './group-view/group-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSliderModule} from '@angular/material/slider';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

import { CommentBoxComponent } from './comment-box/comment-box.component';
import { IndividualSummaryViewComponent } from './individual-summary-view/individual-summary-view.component';
import { NouisliderModule } from 'ng2-nouislider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { AngularSplitModule } from 'angular-split';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import { AngularResizedEventModule } from 'angular-resize-event';

import { ExcelService } from './_services/excel.service';
import { NextComponent } from './next/next.component';

import { RouterModule } from '@angular/router'
import { JoyrideModule } from 'ngx-joyride'


@NgModule({
  declarations: [
    AppComponent,
    IndividualViewComponent,
    // GroupViewComponent,
    CommentBoxComponent,
    IndividualSummaryViewComponent,
    LoginComponent,
    HomeComponent,
    NavComponent,
    NextComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatSliderModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    NouisliderModule,
    DragDropModule,
    AngularMultiSelectModule,
    AngularSplitModule,
    NgxExtendedPdfViewerModule,
    AngularResizedEventModule,
    JoyrideModule.forRoot(),
    RouterModule.forRoot([])

  ],
  providers: [ 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }, 
    ExcelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
