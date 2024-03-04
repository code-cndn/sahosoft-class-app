import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysconfigImageViewComponent } from './sysconfig-image-view.component';

describe('SysconfigImageViewComponent', () => {
  let component: SysconfigImageViewComponent;
  let fixture: ComponentFixture<SysconfigImageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SysconfigImageViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SysconfigImageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
