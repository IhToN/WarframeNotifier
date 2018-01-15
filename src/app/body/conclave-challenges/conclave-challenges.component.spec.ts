import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConclaveChallengesComponent } from './conclave-challenges.component';

describe('ConclaveChallengesComponent', () => {
  let component: ConclaveChallengesComponent;
  let fixture: ComponentFixture<ConclaveChallengesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConclaveChallengesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConclaveChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
