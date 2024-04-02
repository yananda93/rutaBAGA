import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualSummaryViewComponent } from './individual-summary-view.component';

describe('IndividualSummaryViewComponent', () => {
  let component: IndividualSummaryViewComponent;
  let fixture: ComponentFixture<IndividualSummaryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualSummaryViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualSummaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
