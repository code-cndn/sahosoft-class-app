import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSystemConfigComponent } from './user-system-config.component';

describe('UserSystemConfigComponent', () => {
  let component: UserSystemConfigComponent;
  let fixture: ComponentFixture<UserSystemConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSystemConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserSystemConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
