import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningDialogComponent } from './planning-dialog.component';

describe('PlanningDialogComponent', () => {
  let component: PlanningDialogComponent;
  let fixture: ComponentFixture<PlanningDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanningDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
