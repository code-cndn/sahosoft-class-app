import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskQuestionModelComponent } from './ask-question-model.component';

describe('AskQuestionModelComponent', () => {
  let component: AskQuestionModelComponent;
  let fixture: ComponentFixture<AskQuestionModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskQuestionModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AskQuestionModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
