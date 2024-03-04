import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayVideosVideoplayerComponent } from './play-videos-videoplayer.component';

describe('PlayVideosVideoplayerComponent', () => {
  let component: PlayVideosVideoplayerComponent;
  let fixture: ComponentFixture<PlayVideosVideoplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayVideosVideoplayerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayVideosVideoplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
