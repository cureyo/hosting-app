import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FbloginComponent } from './fblogin.component';

describe('FbloginComponent', () => {
  let component: FbloginComponent;
  let fixture: ComponentFixture<FbloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FbloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FbloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
