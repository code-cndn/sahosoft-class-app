import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMyCoursesComponent } from './user-my-courses.component';

describe('UserMyCoursesComponent', () => {
  let component: UserMyCoursesComponent;
  let fixture: ComponentFixture<UserMyCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMyCoursesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserMyCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
