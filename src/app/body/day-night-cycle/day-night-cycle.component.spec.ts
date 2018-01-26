import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayNightCycleComponent } from './day-night-cycle.component';

describe('DayNightCycleComponent', () => {
  let component: DayNightCycleComponent;
  let fixture: ComponentFixture<DayNightCycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayNightCycleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayNightCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
