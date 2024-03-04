import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmazingFeaturesComponent } from './amazing-features.component';

describe('AmazingFeaturesComponent', () => {
  let component: AmazingFeaturesComponent;
  let fixture: ComponentFixture<AmazingFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmazingFeaturesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmazingFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
