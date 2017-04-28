import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUpFormComponent } from './check-up-form.component';

describe('CheckUpFormComponent', () => {
  let component: CheckUpFormComponent;
  let fixture: ComponentFixture<CheckUpFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckUpFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckUpFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
