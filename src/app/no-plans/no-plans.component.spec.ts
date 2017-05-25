import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPlansComponent } from './no-plans.component';

describe('NoPlansComponent', () => {
  let component: NoPlansComponent;
  let fixture: ComponentFixture<NoPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
