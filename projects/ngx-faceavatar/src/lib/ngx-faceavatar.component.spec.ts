import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFaceAvatarComponent } from './ngx-faceavatar.component';

describe('NgxFaceAvatarComponent', () => {
  let component: NgxFaceAvatarComponent;
  let fixture: ComponentFixture<NgxFaceAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxFaceAvatarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxFaceAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
