import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidTraderComponent } from './void-trader.component';

describe('VoidTraderComponent', () => {
  let component: VoidTraderComponent;
  let fixture: ComponentFixture<VoidTraderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoidTraderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoidTraderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
